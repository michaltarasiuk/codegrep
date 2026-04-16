import { isDefined } from "@workspace/shared/is-defined.js";
import type { UIMessage } from "ai";

const DEFAULT_TITLE = "New Chat";

export function getFirstUserText(messages: UIMessage[]) {
  const userMessage = messages.find((message) => message.role === "user");
  if (!isDefined(userMessage)) {
    return DEFAULT_TITLE;
  }
  const textPart = userMessage.parts.find((part) => part.type === "text");
  if (!isDefined(textPart)) {
    return DEFAULT_TITLE;
  }
  return textPart.text;
}
