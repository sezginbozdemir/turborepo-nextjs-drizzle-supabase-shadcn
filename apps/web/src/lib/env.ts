import { createEnv } from "@t3-oss/env-nextjs";
import { resolveEnvs } from "@repo/shared/env-loader";
import { z } from "zod";
resolveEnvs();

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_API_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
});
