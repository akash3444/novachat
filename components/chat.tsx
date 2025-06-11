"use client";

import { useChatContext } from "@/providers/chat";
import { generateChatTitle } from "@/utils/chat";
import { getChatById } from "@/utils/db/chat";
import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "ai";
import { useEffect } from "react";
import { ChatMessageInput } from "./chat-message-input";
import { ChatMessages } from "./chat/messages/chat-messages";
import { WavyDotsLoader } from "./ui/wavy-dots-loader";

export const Chat = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { chatsToBeProcessed } = useChatContext();
  const isChatProcessed = !chatsToBeProcessed[id];

  const { data: chat, isLoading: isLoadingChat } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChatById(id),
    enabled: isChatProcessed,
  });
  const { append, messages, status, reload, stop, error } = useChat({
    experimental_throttle: 50,
    id,
    initialMessages: (chat?.messages as unknown as Message[]) ?? [],
    onError: (error) => {
      console.log("error :", error.message);
    },
  });

  useEffect(() => {
    // Append the initial message if the chat is not processed
    if (!isChatProcessed) {
      append({
        role: "user",
        content: chatsToBeProcessed[id].message,
      });
      // Optimistically add this chat to the chat list
      queryClient.setQueryData(
        ["chats"],
        (oldChatList: { id: string; title: string }[]) => {
          return [{ id, title: "New chat" }, ...oldChatList];
        }
      );

      generateChatTitle(id, chatsToBeProcessed[id].message).then((title) => {
        // Optimistically update the chat title
        queryClient.setQueryData(
          ["chats"],
          (oldChatList: { id: string; title: string }[]) => {
            return oldChatList.map((chat) =>
              chat.id === id ? { ...chat, title } : chat
            );
          }
        );
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-[var(--breakpoint-md)] w-full mx-auto h-screen">
      <div className="grow flex flex-col gap-10 py-6">
        <ChatMessages messages={messages} onRegenerate={reload} />
        {error && (
          <div className="w-fit bg-destructive/15 text-destructive py-2 px-3 rounded-md">
            Could not process your message. Please try again.
          </div>
        )}
        {(isLoadingChat || status === "submitted") && (
          <WavyDotsLoader className="text-muted-foreground" />
        )}
      </div>
      <div className="sticky bottom-0 bg-background pt-4">
        <ChatMessageInput
          isLoading={status === "submitted" || status === "streaming"}
          onSubmit={(message) => {
            append({
              role: "user",
              content: message,
            });
          }}
          onStop={stop}
        />
      </div>
    </div>
  );
};
