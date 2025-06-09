"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface CopyButtonProps extends ComponentProps<typeof Button> {
  text: string;
}

export const CopyButton = ({ text, className, ...props }: CopyButtonProps) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-6", className)}
          onClick={() => copyToClipboard(text)}
          {...props}
        >
          {isCopied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isCopied ? "Copied" : "Copy to clipboard"}
      </TooltipContent>
    </Tooltip>
  );
};
