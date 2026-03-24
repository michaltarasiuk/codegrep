import type { UIMessage } from "ai";

import { isDefined } from "./is-defined";

const DEFAULT_TITLE = "New Chat";

export function getChatTitle(messages: UIMessage[]) {
  const userMessage = messages.find((m) => m.role == "user");
  if (!isDefined(userMessage)) {
    return DEFAULT_TITLE;
  }
  const textPart = userMessage.parts.find((p) => p.type === "text");
  if (!isDefined(textPart)) {
    return DEFAULT_TITLE;
  }
  return textPart.text;
}
