import type { Chat } from "@ai-sdk/svelte";
import { isDefined } from "@workspace/shared/is-defined.js";
import { getContext, setContext } from "svelte";

export type Model = string;

let CHAT_CONTEXT_KEY = Symbol.for("web.chat");
let MODEL_CONTEXT_KEY = Symbol.for("web.model");

export function getChat() {
  let context = getContext<(() => Chat) | undefined>(CHAT_CONTEXT_KEY);
  if (!isDefined(context)) {
    throw new Error("Missing chat context");
  }
  return context();
}

export function setChat(chat: () => Chat) {
  setContext(CHAT_CONTEXT_KEY, chat);
}

export function getModel() {
  let context = getContext<(() => Model) | undefined>(MODEL_CONTEXT_KEY);
  if (!isDefined(context)) {
    throw new Error("Missing model context");
  }
  return context();
}

export function setModel(model: () => Model) {
  setContext(MODEL_CONTEXT_KEY, model);
}
