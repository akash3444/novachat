"use client";

import { cn } from "@/lib/utils";
import { useChatContext } from "@/providers/chat";
import { generateChatTitle } from "@/utils/chat";
import { getChatById } from "@/utils/db/chat";
import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Message, UIMessage } from "ai";
import { RefreshCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatMessageInput } from "./chat-message-input";
import { ReadAloudButton } from "./chat/actions/read-aloud-button";
import { CopyButton } from "./copy-button";
import { Markdown } from "./markdown";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { WavyDotsLoader } from "./ui/wavy-dots-loader";

export const Chat = ({ id }: { id: string }) => {
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const { chatsToBeProcessed } = useChatContext();
  const isChatProcessed = !chatsToBeProcessed[id];

  const { data: chat, isLoading: isLoadingChat } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChatById(id),
    enabled: isChatProcessed,
  });

  const { append, messages, status } = useChat({
    id,
    onError: (error) => {
      console.log("error :", error.message);
    },
    initialMessages: (chat?.messages as unknown as Message[]) ?? [],
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

  // Scroll to the bottom of the chat when new messages appear
  useEffect(() => {
    if (
      bottomOfChatRef.current &&
      (status === "streaming" || status === "submitted")
    ) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              />
            ))}
          </div>
        ))}
        {(isLoadingChat || status === "submitted") && (
          <WavyDotsLoader className="text-muted-foreground" />
        )}
      </div>
      <div ref={bottomOfChatRef} />
      <div className="sticky bottom-0 bg-background pt-4">
        <ChatMessageInput
          isLoading={status === "submitted" || status === "streaming"}
          onSubmit={(message) => {
            append({
              role: "user",
              content: message,
            });
          }}
        />
      </div>
    </div>
  );
};

const MessagePart = ({
  part,
  role,
}: {
  part: UIMessage["parts"][number];
  role: UIMessage["role"];
}) => {
  switch (part.type) {
    case "text":
      if (role === "user") return part.text;
      return (
        <div>
          <Markdown>{part.text}</Markdown>
          <div className="-mt-2 flex items-center -ml-2 gap-0.5">
            <CopyButton
              text={part.text}
              className="size-8 text-muted-foreground"
            />
            <ReadAloudButton
              text={part.text}
              className="size-8 text-muted-foreground"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground"
                >
                  <RefreshCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate message</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      );

    case "step-start":
      return null;

    // TODO: handle these cases
    case "file":
    case "reasoning":
    case "source":
    case "tool-invocation":
      return null;
  }
};
