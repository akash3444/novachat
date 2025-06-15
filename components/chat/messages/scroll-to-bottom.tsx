import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { ComponentProps } from "react";

export const ScrollToBottomButton = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight });
  };

  return (
    <Button
      className={cn("h-8 sticky bottom-4 inset-x-0 mx-auto z-10", className)}
      {...props}
      onClick={scrollToBottom}
    >
      {children ?? (
        <>
          Scroll to bottom <ArrowDown />
        </>
      )}
    </Button>
  );
};
