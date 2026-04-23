import { PUBLIC_WEB_URL } from "$env/static/public";

export function getShareLink(shareId: string) {
  return `${PUBLIC_WEB_URL}/chat/share/${shareId}`;
}
