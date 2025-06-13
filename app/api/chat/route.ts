import { updateChatMessages } from "@/utils/db/chat";
import { Json } from "@/utils/supabase/database.types";
import { createMistral } from "@ai-sdk/mistral";
import { appendResponseMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  // TODO: remove this once we have a proper model
  const mistral = createMistral({ apiKey: process.env.MISTRAL_API_KEY });
  const model = mistral("mistral-small-latest");

  const { messages, id: chatId }: { messages: UIMessage[]; id: string } =
    await req.json();

  const result = streamText({
    model,
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
