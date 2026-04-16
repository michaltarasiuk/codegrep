import { uppercaseFirst } from "@workspace/shared/uppercase-first.js";

export interface ConversationMessage {
  role: "user" | "assistant" | "system" | "data" | "tool";
  content: string;
}

export function messagesToMarkdown(
  messages: ConversationMessage[],
  formatMessage: (
    message: ConversationMessage,
    index: number
  ) => string = defaultFormatMessage
) {
  return messages
    .map((message, index) => formatMessage(message, index))
    .join("\n\n");
}

export function defaultFormatMessage({
  role,
  content = "_No content_",
}: ConversationMessage) {
  const roleLabel = uppercaseFirst(role);
  const normalizedContent = content.replaceAll("\r\n", "\n").trim();
  return `**${roleLabel}**\n\n${normalizedContent}`;
}
