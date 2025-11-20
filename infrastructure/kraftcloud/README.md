# TanStack Start on KraftCloud

The `infrastructure/kraftcloud` tree packages the offline-first TanStack Start SSR demo (`apps/web`) so it can be previewed locally with Docker Compose and then pushed to the exact same container image on Unikraft Cloud. Follow this guide to ship the Nitro server behind a Kraft-managed TLS endpoint that matches the domain configured in your demo (`VITE_SERVER_URL`).

## Table of Contents

- [Overview](#overview)
- [Directory Layout](#directory-layout)
- [Prerequisites](#prerequisites)
- [Local Smoke Test](#local-smoke-test)
- [Kraft Cloud Deployment](#kraft-cloud-deployment)
  - [Prepare the Environment](#prepare-the-environment)
  - [Deploy to a Domain/Subdomain](#deploy-to-a-domainsubdomain)
  - [Redeploy the Existing Service](#redeploy-the-existing-service)
  - [Inspect & Troubleshoot](#inspect--troubleshoot)
- [Reference](#reference)

## Overview

- One source of truth: `Dockerfile.web` builds the TanStack Start SSR runtime that powers local Compose, Kraft Cloud, and the `pnpm --filter @iapacte/apps-web dev` workflow.
- Deterministic settings: `.env` feeds both Docker Compose and Kraft Cloud so the public `VITE_SERVER_URL` always matches the hostname you deploy (important when routing the chat UI + SSR over the same domain).
- Portable deployment: the Kraftfile reuses the exact build context from the monorepo root, exposes TLS on port `443`, and scales to zero between live demos.

## Directory Layout

- `Dockerfile.web` – multi-stage build for the Nitro SSR server published to Kraft Cloud.
- `docker-compose.yaml` – local validation stack that reuses the same Dockerfile.
- `web/` – Kraft manifest plus optional Caddy rootfs assets.
- `.env.example` – shared environment template (`VITE_SERVER_URL`, `NODE_ENV`, `PORT`, `NITRO_PORT`).

## Prerequisites

### Tooling

1. Install Docker Desktop (Compose is bundled) and verify with `docker --version && docker compose version`.
2. Install Nix (see [zero-to-nix](https://zero-to-nix.com/start/install/)) and enter the dev shell for consistent `pnpm`, `kraftkit`, and `openfga-cli` versions:

   ```bash
   nix develop # or nix develop -c zsh
   ```

### Cloud Auth

Export your Unikraft Cloud token and target metro before deploying:

```bash
export UKC_TOKEN="<your-kraftcloud-token>"
export UKC_METRO=fra
```

## Local Smoke Test

Use Docker Compose to confirm the SSR build boots with your `.env` configuration.

```bash
cp infrastructure/kraftcloud/.env.example infrastructure/kraftcloud/.env
docker compose \
  -f infrastructure/kraftcloud/docker-compose.yaml \
  --env-file infrastructure/kraftcloud/.env \
  up --build
```

The TanStack Start server listens on `http://localhost:3000` so you can verify the storyline offline before hitting Kraft Cloud.

## Kraft Cloud Deployment

### Prepare the Environment

1. Copy the env file and set `VITE_SERVER_URL` to the hostname you plan to use on Kraft Cloud (e.g. `https://demo.fra.unikraft.app`) without opening an editor:

   ```bash
   cp infrastructure/kraftcloud/.env.example infrastructure/kraftcloud/.env
   export SUBDOMAIN=iapacte-demo         # pick any DNS-safe slug
   export UKC_METRO=fra                 # change if you deploy elsewhere
   export DOMAIN="$SUBDOMAIN.$UKC_METRO.unikraft.app"
   perl -i -pe "s|^VITE_SERVER_URL=.*|VITE_SERVER_URL=https://$DOMAIN|" infrastructure/kraftcloud/.env
   ```

   Re-run the `export` lines whenever you open a new shell; only `VITE_SERVER_URL` is stored inside `.env`.

2. Load the env vars whenever you deploy:

   ```bash
   set -a; . infrastructure/kraftcloud/.env; set +a
   ```

3. (Optional) warm up the build output to catch failures early:

   ```bash
   pnpm turbo run build --filter=@iapacte/apps-web
   ```

### Deploy to a Domain/Subdomain

Run the deployment from the monorepo root so the Kraftfile can see `Dockerfile.web`. Reuse the `SUBDOMAIN`/`UKC_METRO` exports from the preparation step (export them again if you started a new shell).

```bash
kraft cloud deploy \
  --kraftfile infrastructure/kraftcloud/web/Kraftfile \
  --subdomain "$SUBDOMAIN" \
  -p 80:443/http+redirect \
  -p 443:3000/http+tls \
  -M 1024M \
  .
```

- `--subdomain` provisions `https://$SUBDOMAIN.$UKC_METRO.unikraft.app` automatically; replace with `--domain your-domain.com` when delegating a custom domain.
- The TLS endpoint on `443` is what `apps/web` expects; updating `VITE_SERVER_URL` keeps client + server on the same origin so cookies and SSR data stay in sync.

### Redeploy the Existing Service

If the service already exists, redeploy in-place instead of grabbing a new subdomain:

```bash
SERVICE_NAME=$(kraft cloud service ls --metro "$UKC_METRO" | awk '/iapacte-web/{print $1; exit}')

set -a; . infrastructure/kraftcloud/.env; set +a
kraft cloud deploy \
  --kraftfile infrastructure/kraftcloud/web/Kraftfile \
  --service "$SERVICE_NAME" \
  --rollout remove \
  -M 1024M \
  .
```

Skip `-p`/`--subdomain` flags while redeploying; the existing service retains its ports and hostname.

### Inspect & Troubleshoot

- View running services/instances: `kraft cloud service ls --metro $UKC_METRO` and `kraft cloud instance ls --metro $UKC_METRO`.
- Tail logs: `kraft cloud instance logs <instance> --metro $UKC_METRO`.
- Remove old artifacts when you are done rehearsing: `kraft cloud service remove <service> --metro $UKC_METRO`.
- When the endpoint is live, verify health from your laptop or CI:

  ```bash
  curl -i "https://$DOMAIN/health"
  ```

  (Replace `/health` with whichever Nitro route you expose.)

## Reference

- Unikraft CLI install guide: <https://unikraft.org/docs/cli/install>
- Kraft Cloud product docs: <https://unikraft.org/docs/cloud/>
- TanStack Start docs: <https://tanstack.com/start/latest>
