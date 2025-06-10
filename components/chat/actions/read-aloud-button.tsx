"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CirclePause, Volume2 } from "lucide-react";
import { ComponentProps, useState } from "react";

interface ReadAloudButtonProps extends ComponentProps<typeof Button> {
  text: string;
}

export const ReadAloudButton = ({ text, ...props }: ReadAloudButtonProps) => {
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const readAloud = () => {
    if (!text) return;
    if (isReadingAloud) {
      speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsReadingAloud(false);
    };
    utterance.onerror = () => {
      setIsReadingAloud(false);
    };
    utterance.rate = 0.75;
    setIsReadingAloud(true);
    speechSynthesis.speak(utterance);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={readAloud} {...props}>
          {isReadingAloud ? (
            <CirclePause className="size-5" strokeWidth={1.5} />
          ) : (
            <Volume2 className="size-5" strokeWidth={1.5} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isReadingAloud ? "Stop reading" : "Read aloud"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
