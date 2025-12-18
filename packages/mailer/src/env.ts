import { createEnv } from "@t3-oss/env-core";
import { resolveEnvs } from "@repo/shared/env-loader";
import { z } from "zod";
resolveEnvs();

export const env = createEnv({
  server: {
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_SECURE: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),
  },
  runtimeEnv: process.env,
});
