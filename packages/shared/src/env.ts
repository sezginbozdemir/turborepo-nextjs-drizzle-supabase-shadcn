import { resolveEnvs } from "@repo/shared/env-loader";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
resolveEnvs();

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: process.env,
});
