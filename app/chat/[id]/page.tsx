import { Chat } from "@/components/chat";
import React from "react";

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <Chat id={id} />;
};

export default ChatPage;
