"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useHotkeys } from "react-hotkeys-hook";

export const SidebarToggleShortcut = () => {
  const { toggleSidebar } = useSidebar();
  useHotkeys("cmd+b", toggleSidebar);

  return null;
};
