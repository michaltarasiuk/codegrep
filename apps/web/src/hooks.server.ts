import type { Handle } from "@sveltejs/kit";
import { isDefined } from "@workspace/shared/is-defined.js";

import { authClient } from "$lib/utils/client.server.js";

export const handle: Handle = async ({ event, resolve }) => {
  const requestHeaders = Object.fromEntries(event.request.headers);
  const session = await authClient.getSession({
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

  const response = await resolve(event);
  if (isDefined(setCookie)) {
    response.headers.append("set-cookie", setCookie);
  }
  return response;
};
