import type { Chat } from "@ai-sdk/svelte";
import { getContext, setContext } from "svelte";

export type Model = string;

interface ChatState {
  chat: Chat;
  model: Model;
  messages: Chat["messages"];
  status: Chat["status"];
  isStreaming: boolean;
  isSubmitted: boolean;
}

let CHAT_STATE_KEY = Symbol("chat-state");

export function getChatState(): ChatState {
  return getContext<ChatState>(CHAT_STATE_KEY);
}

export function setChatState(getChat: () => Chat, getModel: () => Model) {
  let state = $derived.by((): ChatState => {
    let chat = getChat();
    let model = getModel();
    return {
      get chat() {
        return chat;
      },
      get model() {
        return model;
      },
      get messages() {
        return chat.messages;
      },
      get status() {
        return chat.status;
      },
      get isStreaming() {
        return chat.status === "streaming";
      },
      get isSubmitted() {
        return chat.status === "submitted";
      },
    };
  });
  setContext(CHAT_STATE_KEY, state);
}
