import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getPinnedChats, getUserChats } from "@/utils/db/chat";
import { BotMessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ChatList } from "./chat-list";
import { NavUser } from "./nav-user";
import { PinnedChatList } from "./pinned-chat-list";
import { SidebarToggleShortcut } from "./sidebar-toggle-shortcut";

export async function ChatSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const chats = await getUserChats();
  const pinnedChats = await getPinnedChats();

  return (
    <Sidebar {...props}>
      <SidebarToggleShortcut />

      <SidebarHeader className="relative px-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 py-2"
          >
            <BotMessageSquare /> <span className="font-semibold">NovaChat</span>
          </Link>
          <SidebarTrigger className="group-data-[state=collapsed]:fixed top-2 left-2" />
        </div>
        <Button asChild>
          <Link href="/">
            <Plus /> New Chat
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <PinnedChatList chats={pinnedChats} />
        <ChatList chats={chats} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
