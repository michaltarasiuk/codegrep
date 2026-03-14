import type { Chat } from "@ai-sdk/svelte";
import { getContext, setContext } from "svelte";

export type Model = string;

const CHAT_CONTEXT_KEY = Symbol("chat");
const MODEL_CONTEXT_KEY = Symbol("model");

export function getChat() {
  const chat = getContext<() => Chat>(CHAT_CONTEXT_KEY);
  return chat();
}

export function setChat(chat: () => Chat) {
  setContext(CHAT_CONTEXT_KEY, chat);
}

export function getModel() {
  const model = getContext<() => Model>(MODEL_CONTEXT_KEY);
  return model();
}

export function setModel(model: () => Model) {
  setContext(MODEL_CONTEXT_KEY, model);
}
