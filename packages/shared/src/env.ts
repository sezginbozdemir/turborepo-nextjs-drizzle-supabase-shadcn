import { resolveEnvs } from "./env-loader/resolve.env.js";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
resolveEnvs();

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
  },
  runtimeEnv: process.env,
});
