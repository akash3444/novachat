"use client";

import { Chat } from "@/components/chat";
import { ChatMessageInput } from "@/components/chat-message-input";
import { ScrollToBottomButton } from "@/components/chat/messages/scroll-to-bottom";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/providers/chat";
import { getChatById } from "@/utils/db/chat";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { UIMessage } from "ai";
import { use, useEffect, useState } from "react";

const ChatPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [isChatScrolledToBottom, setIsChatScrolledToBottom] = useState(false);

  const { id } = use(params);
  const { ref, isIntersecting } = useIntersectionObserver();
  const { selectedModel } = useChatContext();
  const { data: chat } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChatById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });
  useDocumentTitle(chat?.title ?? "NovaChat");

  const initialMessages = chat?.messages as unknown as UIMessage[];

  const aiSdkChat = useChat({
    id,
    initialMessages: initialMessages ?? [],
    sendExtraMessageFields: true,
    onError: (error) => {
      console.log("error :", error.message);
    },
    body: { model: selectedModel },
  });

  const { append, stop, status } = aiSdkChat;

  useEffect(() => {
    if (chat) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight });
        setIsChatScrolledToBottom(true);
      }, 100);
    }
  }, [chat]);

  return (
    <div className="flex flex-col gap-4 max-w-[var(--breakpoint-md)] w-full mx-auto h-screen">
      <div
        className={cn("grow flex flex-col gap-10 py-6", {
          "opacity-0": !isChatScrolledToBottom,
        })}
      >
        {chat && (
          <Chat id={id} initialMessages={initialMessages} chat={aiSdkChat} />
        )}
      </div>
      <div ref={ref} />
      <div className="sticky bottom-0 pt-4 flex flex-col gap-4">
        <ScrollToBottomButton
          className={
            isIntersecting || !isChatScrolledToBottom
              ? "opacity-0"
              : "opacity-100"
          }
        />
        <div className="bg-background">
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
    </div>
  );
};

export default ChatPage;
