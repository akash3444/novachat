"use client";

import { cn } from "@/lib/utils";
import { useChatContext } from "@/providers/chat";
import { getChatById } from "@/utils/db/chat";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatMessageInput } from "./chat-message-input";
import { Markdown } from "./markdown";
import { WavyDotsLoader } from "./ui/wavy-dots-loader";

export const Chat = ({ id }: { id: string }) => {
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const { chatsToBeProcessed } = useChatContext();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const isChatProcessed = !chatsToBeProcessed[id];

  const { append, messages, status } = useChat({
    id,
    onError: (error) => {
      console.log("error :", error.message);
    },
    initialMessages,
  });

  const loadChat = async () => {
    setIsLoadingChat(true);

    try {
      const chat = await getChatById(id);

      if (!chat || !chat.messages) notFound();

      setInitialMessages(chat.messages as unknown as UIMessage[]);
    } catch (error) {
      console.error("Error loading chat :", { id, error });
      notFound();
    } finally {
      setIsLoadingChat(false);
    }
  };

  useEffect(() => {
    // Append the initial message if the chat is not processed
    if (!isChatProcessed) {
      append({
        role: "user",
        content: chatsToBeProcessed[id].message,
      });
      return;
    }

    loadChat();
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
    <div className="flex flex-col gap-4 max-w-[var(--breakpoint-md)] mx-auto max-h-screen pb-4">
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
        <div ref={bottomOfChatRef}></div>
      </div>
      <div className="sticky bottom-0 py-4 bg-background">
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
      return <Markdown>{part.text}</Markdown>;

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
