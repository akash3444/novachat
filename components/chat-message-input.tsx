"use client";

import { useChatContext } from "@/providers/chat";
import { ArrowUp, Loader2, Paperclip } from "lucide-react";
import { useState } from "react";
import { ModelSelector } from "./chat/model-selector";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const ChatMessageInput = ({
  isLoading,
  onSubmit,
  onStop,
}: {
  isLoading?: boolean;
  onSubmit: (message: string) => void;
  onStop?: () => void;
}) => {
  const { selectedModel, setSelectedModel } = useChatContext();
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

  const handleMessage = () => {
    if (isLoading) {
      onStop?.();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="border p-2 pb-0 rounded-t-xl bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:11px_11px] bg-fixed bg-foreground/[0.02]">
      <form className="rounded-t-lg border pb-3 overflow-hidden bg-background">
        <Textarea
          autoFocus
          name="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="!bg-background resize-none border-none shadow-none focus-within:!ring-0 p-4 max-h-40 text-base min-h-22"
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-end justify-between gap-2 px-4">
          <div className="flex items-end gap-2">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" type="button">
                  <Paperclip />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach files</TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" onClick={handleMessage}>
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
    </div>
  );
};
