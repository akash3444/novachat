import { serverEnv } from "@/env/server";
import {
  getChatById,
  updateChatMessages,
  updateChatRecentStreamId,
} from "@/utils/db/chat";
import { DEFAULT_MODEL } from "@/utils/models";
import { Json } from "@/utils/supabase/database.types";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  appendResponseMessages,
  createDataStream,
  generateId,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";

const streamContext = createResumableStreamContext({ waitUntil: after });

export async function POST(req: Request) {
  const openrouter = createOpenRouter({
    apiKey: serverEnv.OPENROUTER_API_KEY,
  });
  const streamId = generateId();

  const {
    messages,
    id: chatId,
    model = DEFAULT_MODEL,
  }: { messages: UIMessage[]; id: string; model: string } = await req.json();
  await updateChatRecentStreamId(chatId, streamId);

  const chatModel = openrouter.chat(model, {
    reasoning: { effort: "low" },
  });

  updateChatMessages(chatId, messages as unknown as Json[]);

  // Build the data stream that will emit tokens
  const stream = createDataStream({
    execute: (dataStream) => {
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

      // Return a resumable stream to the client
      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
        sendSources: true,
      });
    },
  });

  return new Response(
    await streamContext.resumableStream(streamId, () => stream)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("id is required", { status: 400 });
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    return new Response("No chat found", { status: 404 });
  }

  if (!chat.recent_stream_id) {
    return new Response("No recent stream found", { status: 404 });
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(
    chat.recent_stream_id,
    () => emptyDataStream
  );

  if (stream) {
    return new Response(stream, { status: 200 });
  }

  /*
   * For when the generation is "active" during SSR but the
   * resumable stream has concluded after reaching this point.
   */

  const messages = chat.messages as unknown as UIMessage[];
  const mostRecentMessage = messages.at(-1);

  if (!mostRecentMessage || mostRecentMessage.role !== "assistant") {
    return new Response(emptyDataStream, { status: 200 });
  }

  const streamWithMessage = createDataStream({
    execute: (buffer) => {
      buffer.writeData({
        type: "append-message",
        message: JSON.stringify(mostRecentMessage),
      });
    },
  });

  return new Response(streamWithMessage, { status: 200 });
}
