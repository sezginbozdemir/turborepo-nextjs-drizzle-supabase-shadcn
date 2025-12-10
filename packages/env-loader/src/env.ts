import { resolveEnvs } from "./resolve.env.js";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
resolveEnvs();

export const env = createEnv({
  server: {
    SUPABASE_URL: z.string(),
    SUPABASE_ANON_KEY: z.string(),
    PROJECT_REF: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.string(),
    SERVER_PORT: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_SECURE: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: process.env,
});
