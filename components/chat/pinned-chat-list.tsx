"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { ChatItem } from "./chat-item";
import { getPinnedChats } from "@/utils/db/chat";

export function PinnedChatList() {
  const { data: chats } = useQuery({
    queryKey: ["pinned-chats"],
    queryFn: () => getPinnedChats(),
  });

  if (!chats || chats.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pinned Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats?.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
