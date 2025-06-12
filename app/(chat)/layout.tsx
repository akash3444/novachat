import { KeyboardShortcuts } from "@/components/chat/keyboard-shortcuts";
import { ChatSidebar } from "@/components/chat/sidebar/chat-sidebar";
import { ThemeToggleButton } from "@/components/theme/theme-toggle-button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <KeyboardShortcuts />
      <ChatSidebar />
      <SidebarInset className="px-6">{children}</SidebarInset>
      <ThemeToggleButton className="fixed top-2 right-3" />
    </SidebarProvider>
  );
};

export default ChatLayout;
