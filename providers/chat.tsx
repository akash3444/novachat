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
  markChatAsProcessed: (id: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  createInitialChat: () => {},
  chatsToBeProcessed: {},
  selectedModel: DEFAULT_MODEL,
  setSelectedModel: () => {},
  markChatAsProcessed: () => {},
});

type chatsToBeProcessed = Record<string, { message: string }>;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [chatsToBeProcessed, setChatsToBeProcessed] =
    useState<chatsToBeProcessed>({});
  const router = useRouter();

  const createInitialChat = (message: string) => {
    const id = uuidv4();
    setChatsToBeProcessed((prev) => ({
      ...prev,
      [id]: { message },
    }));
    router.push(`/chat/${id}`);
  };

  const markChatAsProcessed = (id: string) => {
    setChatsToBeProcessed((prev) => {
      delete prev[id];
      return prev;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        createInitialChat,
        chatsToBeProcessed,
        selectedModel,
        setSelectedModel,
        markChatAsProcessed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
