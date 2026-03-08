import type { Handle } from "@sveltejs/kit";

import { authClient } from "$lib/utils/client";

export const handle: Handle = async ({ event, resolve }) => {
  const session = await authClient.getSession({
    fetchOptions: {
      fetch: event.fetch,
      headers: Object.fromEntries(event.request.headers),
    },
  });

  let setCookie: string | null = null;
  if (!session.data) {
    await authClient.signIn.anonymous({
      fetchOptions: {
        fetch: event.fetch,
        headers: Object.fromEntries(event.request.headers),
        onSuccess(context: { response: Response }) {
          setCookie = context.response.headers.get("set-cookie");
        },
      },
    });
  }

  const response = await resolve(event);
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  }
  return response;
};
