import { error } from "@sveltejs/kit";

import { client } from "$lib/utils/client";
import { isDefined } from "$lib/utils/is-defined.js";

import type { PageServerLoadEvent } from "./$types";

export async function load({ params, request }: PageServerLoadEvent) {
  if (!isDefined(params.id)) {
    return;
  }
  const chat = client.api.chat({
    id: params.id,
  });
  const persistedMessages = await chat.messages.get({
    headers: Object.fromEntries(request.headers),
  });
  if (!persistedMessages.error) {
    return {
      messages: persistedMessages.data,
    };
  }
  let status = "Failed to load chat";
  if (persistedMessages.error.status === 404) {
    status = "Chat not found";
  }
  throw error(persistedMessages.error.status, status);
}
