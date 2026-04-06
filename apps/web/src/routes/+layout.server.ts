import { client } from "$lib/utils/client.server";
import { CHAT_LIST_KEY } from "$lib/utils/invalidation-keys";

import type { LayoutServerLoadEvent } from "./$types";

export async function load({ request, depends }: LayoutServerLoadEvent) {
  depends(CHAT_LIST_KEY);
  const headers = Object.fromEntries(request.headers);
  const chatList = await client.api.chat.get({
    headers,
  });
  return {
    chatList: chatList.data ?? [],
  };
}
