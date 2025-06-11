"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ThemeToggleButton(props: ComponentProps<typeof Button>) {
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Button variant="outline" size="icon" />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          {...props}
        >
          {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}
