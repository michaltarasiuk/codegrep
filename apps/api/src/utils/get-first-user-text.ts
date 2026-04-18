import { isDefined } from "@workspace/shared/is-defined.js";
import type { UIMessage } from "ai";

let DEFAULT_TITLE = "New Chat";

export function getFirstUserText(messages: UIMessage[]) {
  let userMessage = messages.find((message) => message.role === "user");
  if (!isDefined(userMessage)) {
    return DEFAULT_TITLE;
  }
  let textPart = userMessage.parts.find((part) => part.type === "text");
  if (!isDefined(textPart)) {
    return DEFAULT_TITLE;
  }
  return textPart.text;
}
