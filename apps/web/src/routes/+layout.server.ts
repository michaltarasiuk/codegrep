import { client } from "$lib/utils/client";

import type { LayoutServerLoadEvent } from "./$types";

export async function load({ request, depends }: LayoutServerLoadEvent) {
  depends("app:chat-list");
  const chatList = await client.api.chat.get({
    headers: Object.fromEntries(request.headers),
  });
  return {
    chatList: chatList.data ?? [],
  };
}
