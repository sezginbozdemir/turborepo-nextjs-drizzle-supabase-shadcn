import { createBrowserClient } from "@supabase/ssr";
import { env } from "../env";
import type { Database } from "./supabase.types";

// Create and export a supabase client for browser usage.

export const browserSupabase = createBrowserClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
