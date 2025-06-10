"use client";

import { ArrowUp, Loader2, Paperclip } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const ChatMessageInput = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}) => {
  const [message, setMessage] = useState("");

  const canSendMessage = !!message.trim() && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If the user presses enter and shift is not pressed, submit the form
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!canSendMessage) return;

    onSubmit(message);
    setMessage("");
  };

  return (
    <form className="rounded-t-lg border pb-3">
      <Textarea
        name="message"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none border-none shadow-none focus-within:!ring-0 p-4 max-h-40 text-base"
        rows={3}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between gap-2 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Paperclip />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach a file</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" disabled={!canSendMessage}>
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
};
