"use client";

import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

export const KeyboardShortcuts = () => {
  const router = useRouter();

  useHotkeys("mod+shift+o", () => {
    router.push("/");
  });

  return null;
};
