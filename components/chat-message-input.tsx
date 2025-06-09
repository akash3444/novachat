"use client";

import { useState } from "react";
import { Input } from "./ui/input";

export const ChatMessageInput = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="message"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};
