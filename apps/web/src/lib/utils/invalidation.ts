import { PUBLIC_WEB_URL } from "$env/static/public";

export const CHAT_LIST_KEY = "app:chat-list";

export function getShareLink(shareId: string) {
  return `${PUBLIC_WEB_URL}/chat/share/${shareId}`;
}
