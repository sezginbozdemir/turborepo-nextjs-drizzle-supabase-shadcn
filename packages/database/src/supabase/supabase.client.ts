import { createBrowserClient } from "@supabase/ssr";
import { env } from "../env.js";
import type { Database } from "./supabase.types.js";

// Create and export a supabase client for browser usage.

export const browserSupabase = createBrowserClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
export type { Database as SupabaseDatabase };
