import type { Chat } from "@ai-sdk/svelte";
import { getContext, setContext } from "svelte";

const CHAT_KEY = Symbol("chat");

export function getChat() {
  const chat = getContext<(() => Chat) | undefined>(CHAT_KEY);
  if (!chat) {
    throw new Error("Chat is not defined");
  }
  return chat();
}

export function setChatContext(fn: () => Chat) {
  setContext(CHAT_KEY, fn);
}
