import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export const WavyDotsLoader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("w-fit flex space-x-1 items-center", className)}
    {...props}
  >
    <span className="sr-only">Loading...</span>
    <div className="h-2.5 w-2.5 bg-current rounded-full animate-bounce [animation-delay:-0.25s]"></div>
    <div className="h-2.5 w-2.5 bg-current rounded-full animate-bounce [animation-delay:-0.125s]"></div>
    <div className="h-2.5 w-2.5 bg-current rounded-full animate-bounce "></div>
  </div>
);
