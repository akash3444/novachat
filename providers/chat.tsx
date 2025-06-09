"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ChatContextType {
  createInitialChat: (message: string) => void;
  chatsToBeProcessed: chatsToBeProcessed;
}

const ChatContext = createContext<ChatContextType>({
  createInitialChat: () => {},
  chatsToBeProcessed: {},
});

type chatsToBeProcessed = Record<string, { message: string }>;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatsToBeProcessed, setChatsToBeProcessed] =
    useState<chatsToBeProcessed>({});
  const router = useRouter();

  const createInitialChat = (message: string) => {
    const id = uuidv4();
    setChatsToBeProcessed((prev) => {
      prev[id] = { message };
      return prev;
    });
    router.push(`/chat/${id}`);
  };

  return (
    <ChatContext.Provider value={{ createInitialChat, chatsToBeProcessed }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
