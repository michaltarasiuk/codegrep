import { error } from "@sveltejs/kit";
import { isDefined } from "@workspace/shared/is-defined.js";

import { client } from "$lib/utils/client.server.js";

import type { PageServerLoadEvent } from "./$types";

export async function load({ params: { id }, request }: PageServerLoadEvent) {
  if (!isDefined(id)) {
    return;
  }
  let headers = Object.fromEntries(request.headers);
  let messages = await client.api
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
  throw error(messages.error.status);
}
