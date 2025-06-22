"use client";

import { useChatContext } from "@/providers/chat";
import { ChatMessageInput } from "./chat-message-input";
import { useState } from "react";
import { UIMessage } from "ai";
import { WavyDotsLoader } from "./ui/wavy-dots-loader";
import { ChatMessages } from "./chat/messages/chat-messages";
import { toast } from "sonner";

const getDummyMessages = (chatMessage: string): UIMessage[] => {
  if (!chatMessage) return [];

  return [
    {
      id: "1",
      role: "user",
      content: chatMessage,
      parts: [
        {
          type: "text",
          text: chatMessage,
        },
      ],
    },
  ];
};

export const ChatInputHome = () => {
  const [chatMessage, setChatMessage] = useState("");
  const { createInitialChat } = useChatContext();

  const messages = getDummyMessages(chatMessage);

  const handleSubmit = async (message: string) => {
    try {
      setChatMessage(message);
      await createInitialChat(message);
    } catch {
      toast.error("Failed to create chat. Please try again.");
      setChatMessage("");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[var(--breakpoint-md)] w-full mx-auto h-screen">
      <div className="grow flex flex-col gap-10 py-6">
        <ChatMessages status="submitted" messages={messages} />
        {chatMessage && <WavyDotsLoader className="text-muted-foreground" />}
      </div>
      <div />
      <div className="sticky bottom-0 bg-background pt-4">
        <ChatMessageInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
