"use client";

import { useChatContext } from "@/providers/chat";
import { ChatMessageInput } from "./chat-message-input";

export const ChatInputHome = () => {
  const { createInitialChat } = useChatContext();

  return <ChatMessageInput onSubmit={createInitialChat} />;
};
