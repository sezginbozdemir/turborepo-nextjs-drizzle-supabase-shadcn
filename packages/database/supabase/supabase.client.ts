import { createBrowserClient } from "@supabase/ssr";
import { env } from "@repo/env-loader";
import { Database } from "./supabase.types";

// Create and export a supabase client for browser usage.

export const browserSupabase = createBrowserClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);
