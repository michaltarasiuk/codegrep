import type { Chat } from "@ai-sdk/svelte";
import { getContext, setContext } from "svelte";

export type Model = string;

let CHAT_CONTEXT_KEY = Symbol("chat");
let MODEL_CONTEXT_KEY = Symbol("model");

export function getChat() {
  let chat = getContext<() => Chat>(CHAT_CONTEXT_KEY);
  return chat();
}

export function setChat(chat: () => Chat) {
  setContext(CHAT_CONTEXT_KEY, chat);
}

export function getModel() {
  let model = getContext<() => Model>(MODEL_CONTEXT_KEY);
  return model();
}

export function setModel(model: () => Model) {
  setContext(MODEL_CONTEXT_KEY, model);
}
