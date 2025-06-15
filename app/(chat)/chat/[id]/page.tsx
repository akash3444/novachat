import { Chat } from "@/components/chat";
import { getChatById } from "@/utils/db/chat";
import { UIMessage } from "ai";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const chat = await getChatById(id);

  return {
    title: chat ? `${chat.title} - NovaChat` : "NovaChat",
  };
};

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const chat = await getChatById(id);

  const initialMessages = chat?.messages as unknown as UIMessage[];

  return <Chat id={id} initialMessages={initialMessages} />;
};

export default ChatPage;
