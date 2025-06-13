import { serverEnv } from "@/env/server";
import { updateChatMessages } from "@/utils/db/chat";
import { DEFAULT_MODEL } from "@/utils/models";
import { Json } from "@/utils/supabase/database.types";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  appendResponseMessages,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";

export async function POST(req: Request) {
  const openrouter = createOpenRouter({
    apiKey: serverEnv.OPENROUTER_API_KEY,
  });

  const {
    messages,
    id: chatId,
    model = DEFAULT_MODEL,
  }: { messages: UIMessage[]; id: string; model: string } = await req.json();

  const chatModel = openrouter.chat(model, {
    reasoning: { effort: "low" },
  });

  const result = streamText({
    experimental_transform: smoothStream(),
    model: chatModel,
    messages,
    onFinish: async ({ response }) => {
      const allMessages = appendResponseMessages({
        messages,
        responseMessages: response.messages,
      });

      await updateChatMessages(chatId, allMessages as unknown as Json[]);
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
