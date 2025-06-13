"use server";

import { generateText } from "ai";
import { updateChatTitle } from "./db/chat";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { serverEnv } from "@/env/server";

export const generateChatTitle = async (id: string, message: string) => {
  const openrouter = createOpenRouter({
    apiKey: serverEnv.OPENROUTER_API_KEY,
  });
  const model = openrouter.chat("openai/gpt-4o-mini");

  const result = await generateText({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates titles for chat messages. The title should be a single phrase that captures the essence of the chat. Your response should only be the title, no other text, no explanation, or no quotation marks.",
      },
      {
        role: "user",
        content: `Generate a title for this chat: ${message}`,
      },
    ],
  });

  if (!result.text) return;

  await updateChatTitle(id, result.text);

  return result.text;
};
