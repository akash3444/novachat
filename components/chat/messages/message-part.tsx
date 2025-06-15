import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { exportMarkdown, exportNodeAsImage } from "@/utils/export";
import { UIMessage } from "ai";
import {
  ChevronDown,
  FileText,
  ImageIcon,
  RefreshCcw,
  Share,
} from "lucide-react";
import { useRef } from "react";
import { ReadAloudButton } from "../actions/read-aloud-button";
import { UseChatHelpers } from "@ai-sdk/react";

export const MessagePart = ({
  part,
  role,
  onRegenerate,
  status,
  isLastMessage,
}: {
  part: UIMessage["parts"][number];
  role: UIMessage["role"];
  onRegenerate: () => void;
  status: UseChatHelpers["status"];
  isLastMessage: boolean;
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const isMessageReady = !status || status === "ready";

  switch (part.type) {
    case "text":
      if (role === "user") return part.text;

      return (
        <div>
          <div className="-m-4">
            <div ref={messageRef} className="p-4">
              <Markdown>{part.text}</Markdown>
            </div>
          </div>

          {(!isLastMessage || (isLastMessage && isMessageReady)) && (
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
                <DropdownMenu>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground"
                        onClick={onRegenerate}
                      >
                        <Share />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => exportMarkdown(part.text)}
                    >
                      <FileText /> Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        messageRef.current &&
                        exportNodeAsImage(
                          messageRef.current,
                          "chat-message.png"
                        )
                      }
                    >
                      <ImageIcon /> Export as Image
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipContent>
                  <p>Export message</p>
                </TooltipContent>
              </Tooltip>

              {/* Display the regenerate button only if the message is ready */}
              {isMessageReady && (
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
              )}
            </div>
          )}
        </div>
      );

    case "step-start":
      return null;

    case "reasoning":
      return (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="-ml-3 group">
              Reasoning{" "}
              <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />{" "}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-l pl-4">
            <Markdown>{part.reasoning}</Markdown>
          </CollapsibleContent>
        </Collapsible>
      );

    // TODO: handle these cases
    case "file":
    case "source":
    case "tool-invocation":
      return null;
  }
};
