import { resolveEnvs } from "@repo/shared/env-loader";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
resolveEnvs();

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_WEB_URL: z.string(),
    SERVER_PORT: z.string(),
    PROJECT_REF: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: process.env,
});
