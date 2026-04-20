import type { Chat } from "@ai-sdk/svelte";
import { isDefined } from "@workspace/shared/is-defined.js";
import { getContext, setContext } from "svelte";

export type Model = string;

const CHAT_CONTEXT_KEY = Symbol.for("chat");
const MODEL_CONTEXT_KEY = Symbol.for("model");

export function getChat() {
  let value = getContext<(() => Chat) | undefined>(CHAT_CONTEXT_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing chat context value");
  }
  return value();
}

export function setChat(chat: () => Chat) {
  return setContext(CHAT_CONTEXT_KEY, chat);
}

export function getModel() {
  let value = getContext<(() => Model) | undefined>(MODEL_CONTEXT_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing model context value");
  }
  return value();
}

export function setModel(model: () => Model) {
  return setContext(MODEL_CONTEXT_KEY, model);
}
