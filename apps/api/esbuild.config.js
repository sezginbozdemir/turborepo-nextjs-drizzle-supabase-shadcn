import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/bundle.js",
    external: [
      "dotenv",
      "express",
      "compression",
      "cookie-parser",
      "cors",
      "esbuild",
      "@sentry/node",
      "express",
      "hpp",
      "pg",
    ],
    bundle: true,
    platform: "node",
    format: "esm",
    alias: {
      "#": "./src",
    },
  })
  .catch(() => process.exit(1));
