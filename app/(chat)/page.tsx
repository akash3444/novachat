import { ChatInputHome } from "@/components/chat-input-home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Chat - NovaChat",
  description: "Create a new chat with NovaChat",
};

export default function Home() {
  return (
    <div>
      <ChatInputHome />
    </div>
  );
}
