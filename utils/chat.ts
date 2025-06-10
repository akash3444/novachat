"use server";

import { createMistral } from "@ai-sdk/mistral";
import { generateText } from "ai";
import { updateChatTitle } from "./db/chat";

export const generateChatTitle = async (id: string, message: string) => {
  const mistral = createMistral({ apiKey: process.env.MISTRAL_API_KEY });
  const model = mistral("mistral-small-latest");

  const result = await generateText({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates titles for chat messages. The title should be a single phrase that captures the essence of the chat. Your response should only be the title, no other text, explanation, or quotation marks.",
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
