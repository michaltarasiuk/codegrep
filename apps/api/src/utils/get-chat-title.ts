import type { UIMessage } from "ai";

let DEFAULT_TITLE = "New Chat";

export function getChatTitle(messages: UIMessage[]) {
  let title = DEFAULT_TITLE;
  for (let message of messages) {
    if (message.role === "user") {
      for (let part of message.parts) {
        if (part.type === "text") {
          title = part.text;
        }
      }
    }
  }
  return title;
}
