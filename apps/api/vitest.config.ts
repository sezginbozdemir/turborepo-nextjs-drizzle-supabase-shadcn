import { defineConfig, mergeConfig } from "vitest/config";
import { baseConfig } from "@repo/vitest-config";
import path from "node:path";

export default defineConfig(
  mergeConfig(baseConfig, {
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      testTimeout: 30_000,
    },
  }),
);
