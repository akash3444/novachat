"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "../supabase/admin";
import { Json } from "../supabase/database.types";

export const updateChatMessages = async (id: string, messages: Json[]) => {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabaseAdmin
    .from("chats")
    .upsert(
      { messages, id, user_id: user.data.user?.id },
      { onConflict: "id" }
    );

  if (error) throw error;

  return data;
};

export const getChatById = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};
