import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { serverEnv } from "@/env/server";
import { clientEnv } from "@/env/client";

export const createAdminClient = () =>
  createClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL || "",
    serverEnv.SUPABASE_SERVICE_ROLE_KEY || ""
  );
