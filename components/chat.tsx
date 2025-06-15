"use client";

import { useAutoResume } from "@/hooks/use-auto-resume";
import { useChatContext } from "@/providers/chat";
import { generateChatTitle } from "@/utils/chat";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { UIMessage } from "ai";
import { useEffect } from "react";
import { ChatMessageInput } from "./chat-message-input";
import { ChatMessages } from "./chat/messages/chat-messages";
import { WavyDotsLoader } from "./ui/wavy-dots-loader";

export const Chat = ({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: UIMessage[];
}) => {
  const queryClient = useQueryClient();
  const { chatsToBeProcessed, markChatAsProcessed, selectedModel } =
    useChatContext();
  const isChatProcessed = !chatsToBeProcessed[id];

  const {
    append,
    messages,
    status,
    reload,
    stop,
    error,
    experimental_resume,
    setMessages,
    data,
  } = useChat({
    id,
    initialMessages: initialMessages ?? [],
    sendExtraMessageFields: true,
    onError: (error) => {
      console.log("error :", error.message);
    },
    body: { model: selectedModel },
  });

  useAutoResume({
    autoResume: true,
    initialMessages: initialMessages ?? [],
    experimental_resume,
    data,
    setMessages,
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
        (oldChats: {
          pages: {
            data: { id: string; title: string; is_pinned: boolean }[];
            count: number;
          }[];
        }) => {
          const firstPage = oldChats.pages[0];
          const lastPage = oldChats.pages[oldChats.pages.length - 1];
          const lastPageCount = lastPage.count;

          return {
            ...oldChats,
            pages: [
              {
                ...firstPage,
                data: [
                  { id, title: "New chat", is_pinned: false },
                  ...firstPage.data,
                ],
                count: lastPageCount + 1,
              },
              ...oldChats.pages.slice(1),
            ],
          };
        }
      );

      generateChatTitle(id, chatsToBeProcessed[id].message).then((title) => {
        // Optimistically update the chat title
        queryClient.setQueryData(
          ["chats"],
          (oldChats: {
            pages: {
              data: { id: string; title: string; is_pinned: boolean }[];
              count: number;
            }[];
          }) => ({
            ...oldChats,
            pages: oldChats.pages.map((page) => ({
              ...page,
              data: page.data.map((chat) => ({
                ...chat,
                title: chat.id === id ? title : chat.title,
              })),
            })),
          })
        );
      });

      markChatAsProcessed(id);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-[var(--breakpoint-md)] w-full mx-auto h-screen">
      <div className="grow flex flex-col gap-10 py-6">
        <ChatMessages
          status={status}
          messages={messages}
          onRegenerate={reload}
        />
        {error && (
          <div className="w-fit bg-destructive/15 text-destructive py-2 px-3 rounded-md">
            Could not process your message. Please try again.
          </div>
        )}
        {status === "submitted" && (
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
