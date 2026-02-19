import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/bundle.js",
    bundle: true,
    external: ["pg", "dotenv"],
    platform: "node",
    format: "esm",
    alias: {
      "@": "./src",
    },
  })
  .catch(() => process.exit(1));
