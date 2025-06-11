import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { UIMessage } from "ai";
import { ReadAloudButton } from "../actions/read-aloud-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const MessagePart = ({
  part,
  role,
  onRegenerate,
}: {
  part: UIMessage["parts"][number];
  role: UIMessage["role"];
  onRegenerate: () => void;
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
                  onClick={onRegenerate}
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
