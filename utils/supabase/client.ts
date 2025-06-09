import { clientEnv } from "@/env/client";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
