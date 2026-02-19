import { resolveEnvs } from "@repo/shared/env-loader";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

resolveEnvs();

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
    SUPABASE_PROJECT_REF: z.string(),
    DATABASE_URL: z.string(),
  },
  runtimeEnv: process.env,
});
