import type { UIMessage } from "ai";

const DEFAULT_TITLE = "New Chat";

export function getChatTitle(messages: UIMessage[]) {
  for (let message of messages) {
    if (message.role !== "user") continue;
    for (let part of message.parts) {
      if (part.type === "text" && part.text.length > 0) {
        return part.text;
      }
    }
  }
  return DEFAULT_TITLE;
}
