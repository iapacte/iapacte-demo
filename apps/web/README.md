# Iapacte Demo - Color Scheme and Medieval Vibes

Iapacte Demo's design embraces a medieval-inspired aesthetic to reflect the centuries-old heritage of city councils, incorporating elements like shields and flags. This style draws from ancient manuscripts, stone castles, and heraldic traditions, achieved through an earthy color palette, textured elements, and serif typography.

## Demo tone and goal

The web app is a UI-only, demo aimed at Catalan-speaking city council teams during a single in-person sales and feedback session. All screens are written as story-driven “relats” that make it easy for mayors, heads of service, and intervention/secretariat teams to see themselves using Iapacte in real committee and plenary work.

- **Tone**: Calm, confident, and pragmatic, focusing on impact, traceability, and citizen benefit instead of technical details. Copy is conversational in Catalan but precise enough to feel credible in front of elected officials.
- **Narrative goal**: Walk through one cohesive storyline that starts from a shared civic “spreadsheet” (Data Collector), dives into a structured vault of tenders, grants, and AI prompts (Tenders & Grants), and finishes on visual AI workflows that the chat can trigger dynamically (AI Workflow Builder).
- **Sales intent**: Remove friction and uncertainty in the live meeting by keeping all data mocked, deterministic, and offline, so the presenter can confidently improvise around questions while the UI always behaves the same.

## Medieval Vibes and Design Inspiration

The medieval vibe is crafted with:

- **Earthy Color Palette**: Warm, natural tones inspired by aged parchment, forest earth, and royal insignia.
- **Textured Elements**: Subtle shadows and borders reminiscent of carved stone or weathered wood.
- **Typography**: Cinzel for stately display text and Cardo for classic headings/labels, paired with DM Sans for readable body text.

## Assigned Colors

The color scheme, developed using the [Material Design Theme Builder](https://material-foundation.github.io/material-theme-builder/), features the following source colors to evoke a medieval feel:

- **Primary: #A52A2A**  
  A reddish-brown, evoking medieval banners and wooden halls, used for key actions like buttons and highlights.
- **Secondary: #5C4033**  
  A dark brown, resembling aged wood or earth, applied to supporting elements like navigation and icons.
- **Tertiary: #DAA520**  
  A golden yellow, mimicking royal seals and shields, used for accents like tabs or tertiary information.
- **Error: #D2691E**  
  A burnt orange, inspired by urgent medieval warnings, for alerts and error states.
- **Neutral: #D2B48C**  
  A light tan, like parchment or stone walls, serving as the background and surface color.
- **Neutral Variant: #5C4033**  
  A darker brown variant, used for medium emphasis like outlines and dividers, adding depth.

These colors are processed into a full Material Design 3 palette, generating light and dark themes for integration into `apps/web/src/styles/global.css` with Tailwind CSS.

## Current navigation (only `/` and `/product/*`)

- Home (`/`, `apps/web/src/routes/index.tsx`): Persona filter + single list of 8 use cases (mix of relats and product links). Chips inside each card navigate to the relevant product screens.
- Product: Workflows (`/product/workflows`, `/product/workflows/$workflowId`): Catalog and detail of workflows; all canvas references stay within `/product/*`.
- Product: Tenders (`/product/tenders`): Drive-style vault plus embedded interactive table with filters and tags (tenders demo embedded here).
- Product: Data (`/product/data`, `/product/data/connectors`): Data overview cards plus embedded DataCollector grid (`#graella-demo` anchor) and connectors gallery.
- Product: Templates (`/product/templates`, `/product/templates/$templateId`): AI prompt catalog and read-only template dialog.
- Product: Apps (`/product/apps`): Builder-style screen to configure internal chats or external WordPress forms and list simulated published apps.
