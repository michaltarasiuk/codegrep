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
  const messages = await chat.messages.get({
    headers: Object.fromEntries(request.headers),
  });
  if (!messages.error) {
    return {
      messages: messages.data,
    };
  }
  let status = "Failed to load chat";
  if (messages.error.status === 404) {
    status = "Chat not found";
  }
  throw error(messages.error.status, status);
}
