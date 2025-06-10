import { Chat } from "@/components/chat";
import { getChatById } from "@/utils/db/chat";

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
  return <Chat id={id} />;
};

export default ChatPage;
