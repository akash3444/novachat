"use client";

import { DEFAULT_MODEL } from "@/utils/models";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ChatContextType {
  createInitialChat: (message: string) => void;
  chatsToBeProcessed: chatsToBeProcessed;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  createInitialChat: () => {},
  chatsToBeProcessed: {},
  selectedModel: DEFAULT_MODEL,
  setSelectedModel: () => {},
});

type chatsToBeProcessed = Record<string, { message: string }>;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
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
    <ChatContext.Provider
      value={{
        createInitialChat,
        chatsToBeProcessed,
        selectedModel,
        setSelectedModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
