"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { getUserChats } from "@/utils/db/chat";
import { useQuery } from "@tanstack/react-query";
import { ChatItem } from "./chat-item";

export function ChatList() {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getUserChats(),
  });

  return (
    <SidebarGroup className="grid">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? null : chats?.length ? (
          chats?.map((chat) => <ChatItem key={chat.id} chat={chat} />)
        ) : (
          <p className="text-sm text-center text-muted-foreground">No chats</p>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
