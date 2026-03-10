import { client } from "$lib/utils/client";

import type { PageServerLoadEvent } from "./$types";

export async function load({ params, request }: PageServerLoadEvent) {
  const chatId = params.id;

  const messages = await client.api
    .chat({
      chatId,
    })
    .messages.get({
      headers: Object.fromEntries(request.headers),
    });

  return {
    chatId,
    initialMessages: messages.data ?? [],
  };
}
