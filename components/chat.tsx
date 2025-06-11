"use client";

import { cn } from "@/lib/utils";
import { useChatContext } from "@/providers/chat";
import { generateChatTitle } from "@/utils/chat";
import { getChatById } from "@/utils/db/chat";
import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "ai";
import { useEffect } from "react";
import { ChatMessageInput } from "./chat-message-input";
import { WavyDotsLoader } from "./ui/wavy-dots-loader";
import { MessagePart } from "./chat/messages/message-part";

export const Chat = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { chatsToBeProcessed } = useChatContext();
  const isChatProcessed = !chatsToBeProcessed[id];

  const { data: chat, isLoading: isLoadingChat } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChatById(id),
    enabled: isChatProcessed,
  });
  const { append, messages, status, reload, stop } = useChat({
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
        {messages.map((message, index) => (
          <div
            // Fix the key issue
            key={`${id}-${index}`}
            className={cn("w-auto", {
              "bg-muted ml-auto py-1.5 px-3.5 rounded-lg":
                message.role === "user",
              "prose prose-pre:p-0 prose-pre:bg-transparent prose-pre:border max-w-[var(--breakpoint-md)]":
                message.role !== "user",
            })}
          >
            {message.parts.map((part, index) => (
              <MessagePart
                key={`${message.id}-${part.type}-${index}`}
                part={part}
                role={message.role}
                onRegenerate={() => {
                  reload();
                }}
              />
            ))}
          </div>
        ))}
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
