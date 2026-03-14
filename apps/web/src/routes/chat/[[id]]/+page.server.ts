import type { UIMessage } from "ai";

import { client } from "$lib/utils/client";
import { isDefined } from "$lib/utils/is-defined.js";

import type { PageServerLoadEvent } from "./$types";

export async function load({ params, request }: PageServerLoadEvent) {
  let messages: UIMessage[] = [];
  if (isDefined(params.id)) {
    const chat = client.api.chat({
      id: params.id,
    });
    const persistedMessages = await chat.messages.get({
      headers: Object.fromEntries(request.headers),
    });
    messages = persistedMessages.data ?? [];
  }
  return {
    messages,
  };
}
