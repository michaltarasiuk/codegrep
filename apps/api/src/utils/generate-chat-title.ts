import { generateText, type UIMessage } from "ai";

import { NoUserMessageError } from "$api/errors";
import { ai } from "$api/modules/chat/ai";

import { isDefined } from "./is-defined";

export async function generateChatTitle(model: string, messages: UIMessage[]) {
  const userMessage = messages.find((m) => m.role === "user");
  if (!isDefined(userMessage)) {
    return new NoUserMessageError();
  }
  const { text } = await generateText({
    model: ai(model),
    system:
      "Generate a 1-5 word chat title. " +
      "Use the user's exact words or names when possible. " +
      "No quotes, no periods, no commentary. Plain text only.",
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
