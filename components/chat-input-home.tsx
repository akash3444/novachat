"use client";

import { useChatContext } from "@/providers/chat";
import { ChatMessageInput } from "./chat-message-input";

export const ChatInputHome = () => {
  const { createInitialChat } = useChatContext();

  return (
    <div className="flex flex-col gap-4 max-w-[var(--breakpoint-md)] w-full mx-auto h-screen">
      <div className="grow"></div>
      <div className="sticky bottom-0 bg-background pt-4">
        <ChatMessageInput onSubmit={createInitialChat} />
      </div>
    </div>
  );
};
