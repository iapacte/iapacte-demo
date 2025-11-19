{
  description = "Iapacte Demo Monorepo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    unikraft-nur = {
      url = "github:unikraft/nur";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, unikraft-nur }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        kraftkit = unikraft-nur.packages.${system}.kraftkit;
        oldPkgs =
          import (pkgs.fetchFromGitHub {
            owner = "NixOS";
            repo = "nixpkgs";
            rev = "1bb16e1d19968ac62e8cdf0ffaf2fa070f701b24";
            sha256 = "1qgbm1iz2gps1alnacpv48kksq5ypz2f6av984h2cdzm21jq712f";
          }) { inherit system; };
        openfga-cli = oldPkgs.openfga-cli;
      in
      {
          devShells.default = pkgs.mkShell {
         buildInputs = [
						pkgs.corepack_24
            pkgs.git
            pkgs.gh
            pkgs.nodejs_24
            kraftkit
            openfga-cli # OpenFGA CLI (pinned until upstream update lands in nixpkgs)
            pkgs.starship # shell beautifier
            pkgs.typescript
            pkgs.zsh # ensure zsh is available for nix develop -c zsh
          ];


          shellHook = ''
            echo "🚀 Iapacte Demo Monorepo"
            echo "Node.js $(node --version)"
            echo "TypeScript $(tsc --version)"
            echo "pnpm $(pnpm --version)"
            echo "OpenFGA $(fga --version)"
            echo "Unikraft $(kraft version)"
            echo ""

            # Initialize Starship prompt for this Bash shell
            eval "$(starship init bash)"
          '';

          # Set environment variables
          NODE_ENV = "development";
        };
      });
}
