import { error } from "@sveltejs/kit";

import { client } from "$lib/utils/client.server.js";
import { isDefined } from "$lib/utils/is-defined.js";

import type { PageServerLoadEvent } from "./$types";

export async function load({ params: { id }, request }: PageServerLoadEvent) {
  if (!isDefined(id)) {
    return;
  }
  const headers = Object.fromEntries(request.headers);
  const messages = await client.api
    .chat({
      id,
    })
    .messages.get({
      headers,
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
