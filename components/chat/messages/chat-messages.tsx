import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { MessagePart } from "./message-part";

export const ChatMessages = ({
  messages,
  onRegenerate = () => {},
}: {
  messages: UIMessage[];
  onRegenerate?: () => void;
}) => {
  return messages.map((message, index) => (
    <div
      // TODO: Fix the key issue
      key={`${message.id}-${message.role}-${index}`}
      className={cn("w-auto", {
        "bg-muted ml-auto py-2 px-3.5 rounded-lg": message.role === "user",
        "prose prose-pre:p-0 prose-pre:bg-transparent prose-pre:border max-w-[var(--breakpoint-md)] dark:prose-invert dark:!text-foreground":
          message.role !== "user",
      })}
    >
      {message.parts.map((part, index) => (
        <MessagePart
          key={`${message.id}-${part.type}-${index}`}
          part={part}
          role={message.role}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  ));
};
