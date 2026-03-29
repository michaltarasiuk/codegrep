import { error } from "@sveltejs/kit";

import { client } from "$lib/utils/client.server";
import { isDefined } from "$lib/utils/is-defined.js";

import type { PageServerLoadEvent } from "./$types";

export async function load({ params: { id }, request }: PageServerLoadEvent) {
  if (!isDefined(id)) {
    return;
  }
  const requestHeaders = Object.fromEntries(request.headers);
  const chat = client.api.chat({
    id,
  });
  const messages = await chat.messages.get({
    headers: requestHeaders,
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
