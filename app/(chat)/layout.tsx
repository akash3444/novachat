import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset className="px-6">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default ChatLayout;
