import { defineConfig } from "vitest/config";
import { baseConfig } from "@repo/vitest-config";
import path from "node:path";

export default defineConfig({
  ...baseConfig,

  resolve: {
    ...(baseConfig as any).resolve,
    alias: {
      ...((baseConfig as any).resolve?.alias ?? {}),
      src: path.resolve(__dirname, "./src"),
    },
  },

  test: {
    ...baseConfig.test,
    testTimeout: 30_000,
  },
});
