import type { Handle } from "@sveltejs/kit";
import { isDefined } from "@workspace/shared/is-defined.js";

import { authClient } from "$lib/utils/client.server.js";

export let handle: Handle = async ({ event, resolve }) => {
  let requestHeaders = Object.fromEntries(event.request.headers);
  let session = await authClient.getSession({
    fetchOptions: {
      fetch: event.fetch,
      headers: requestHeaders,
    },
  });

  let setCookie: string | null = null;
  if (!isDefined(session.data)) {
    await authClient.signIn.anonymous({
      fetchOptions: {
        fetch: event.fetch,
        headers: requestHeaders,
        onSuccess(context) {
          setCookie = context.response.headers.get("set-cookie");
        },
      },
    });
  }

  let response = await resolve(event);
  if (isDefined(setCookie)) {
    response.headers.append("set-cookie", setCookie);
  }
  return response;
};
