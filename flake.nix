{
  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs = {nixpkgs, ...}: {
    devShells =
      builtins.mapAttrs (_system: pkgs: {
        default = pkgs.mkShellNoCC {
          packages = with pkgs; [nodejs_22];
        };
      })
      nixpkgs.legacyPackages;
  };
}
