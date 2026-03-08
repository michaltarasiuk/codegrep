import { client } from "$lib/utils/client";

export const prerender = false;

export async function load({ params, request }) {
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
