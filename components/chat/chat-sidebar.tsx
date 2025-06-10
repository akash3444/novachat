"use client";

import { BotMessageSquare, Plus } from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChatList } from "./chat-list";
import { NavUser } from "./nav-user";
import { PinnedChatList } from "./pinned-chat-list";

export function ChatSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
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
        <PinnedChatList />
        <ChatList />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
