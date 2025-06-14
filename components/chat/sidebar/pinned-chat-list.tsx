"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { getPinnedChats } from "@/utils/db/chat";
import { useQuery } from "@tanstack/react-query";
import { ChatItem } from "./chat-item";

export function PinnedChatList({
  chats,
}: {
  chats: { id: string; title: string; is_pinned: boolean }[];
}) {
  const { data: pinnedChats } = useQuery({
    queryKey: ["pinned-chats"],
    queryFn: () => getPinnedChats(),
    initialData: chats,
    enabled: false,
  });
  if (!chats || chats.length === 0) return null;

  return (
    <SidebarGroup className="grid">
      <SidebarGroupLabel>Pinned Chats</SidebarGroupLabel>
      <SidebarMenu>
        {pinnedChats?.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
