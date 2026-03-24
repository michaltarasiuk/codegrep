import type { UIMessage } from "ai";

const DEFAULT_TITLE = "New Chat";

export function getChatTitle(messages: UIMessage[]) {
  let chatTitle = DEFAULT_TITLE;
  for (const message of messages) {
    if (message.role !== "user") {
      continue;
    }
    for (const part of message.parts) {
      if (part.type === "text") {
        chatTitle = part.text;
      }
    }
  }
  return chatTitle;
}
