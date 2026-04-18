import { client } from "$lib/utils/client.server.js";
import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";

import type { LayoutServerLoadEvent } from "./$types";

export async function load({ request, depends }: LayoutServerLoadEvent) {
  depends(CHAT_LIST_KEY);
  let headers = Object.fromEntries(request.headers);
  let chatList = await client.api.chat.get({
    headers,
  });
  return {
    chatList: chatList.data ?? [],
  };
}
