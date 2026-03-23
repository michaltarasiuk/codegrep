import { generateText, type UIMessage } from "ai";

import { NoUserMessageError } from "$api/errors";
import { ai } from "$api/modules/chat/ai";

import { isDefined } from "./is-defined";

export async function generateChatTitle(model: string, messages: UIMessage[]) {
  const userMessage = messages.find((m) => m.role === "user");
  if (!isDefined(userMessage)) {
    throw new NoUserMessageError();
  }
  const { text } = await generateText({
    model: ai(model),
    system:
      "Generate a concise title (max 5 words) for this chat. " +
      "Output only plain text, no quotes or formatting.",
    prompt: getPrompt(userMessage),
  });
  return text;
}

function getPrompt(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}
