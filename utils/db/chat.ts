"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "../supabase/admin";
import { Json } from "../supabase/database.types";

// Update chat messages
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

export const getUserChats = async (page: number = 0, pageSize: number = 20) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const from = page * pageSize;
  const to = (page + 1) * pageSize - 1;

  const { data, count, error } = await supabase
    .from("chats")
    .select("id, title, is_pinned", { count: "exact" })
    .eq("user_id", user.data.user?.id)
    .eq("is_pinned", false)
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data, count };
};

export const getPinnedChats = async (
  page: number = 0,
  pageSize: number = 10
) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const from = page * pageSize;
  const to = (page + 1) * pageSize - 1;

  const { data, error } = await supabase
    .from("chats")
    .select("id, title, is_pinned")
    .eq("user_id", user.data.user?.id)
    .eq("is_pinned", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data;
};

export const updateChatTitle = async (id: string, title: string) => {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabaseAdmin
    .from("chats")
    .upsert(
      { title, id, user_id: user.data.user?.id, messages: [] },
      { onConflict: "id" }
    );

  if (error) throw error;

  return data;
};

export const deleteChatById = async (id: string) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.from("chats").delete().eq("id", id);

  if (error) throw error;

  return data;
};

export const updateChatPinStatus = async (id: string, is_pinned: boolean) => {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabaseAdmin
    .from("chats")
    .update({ is_pinned })
    .eq("id", id)
    .eq("user_id", user.data.user?.id);

  if (error) throw error;

  return data;
};

export const updateChatRecentStreamId = async (
  chatId: string,
  streamId: string
) => {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabaseAdmin.from("chats").upsert(
    {
      recent_stream_id: streamId,
      id: chatId,
      user_id: user.data.user?.id,
      messages: [],
      title: "New chat",
      is_pinned: false,
    },
    { onConflict: "id" }
  );

  if (error) throw error;
};
