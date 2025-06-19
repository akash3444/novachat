import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { MessagePart } from "./message-part";
import { UseChatHelpers } from "@ai-sdk/react";

export const ChatMessages = ({
  status,
  messages,
  onRegenerate = () => {},
}: {
  status: UseChatHelpers["status"];
  messages: UIMessage[];
  onRegenerate?: () => void;
}) => {
  const lastMessageIndex = messages.length - 1;

  return messages.map((message, index) => {
    const isLastMessage = index === lastMessageIndex;

    return (
      <div
        key={`${message.id}-${message.role}-${index}`}
        className={cn("w-auto", {
          "bg-muted ml-auto py-2 px-3.5 rounded-lg": message.role === "user",
          "prose prose-pre:p-0 prose-pre:bg-transparent prose-pre:border prose-pre:overflow-visible max-w-[var(--breakpoint-md)] dark:prose-invert dark:!text-foreground":
            message.role !== "user",
        })}
      >
        {message.parts.map((part, index) => (
          <MessagePart
            key={`${message.id}-${part.type}-${index}`}
            part={part}
            role={message.role}
            onRegenerate={onRegenerate}
            status={status}
            isLastMessage={isLastMessage}
          />
        ))}
      </div>
    );
  });
};
