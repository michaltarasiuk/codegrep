import { defineMiddleware } from "astro:middleware";

import { authClient } from "$lib/utils/client";

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: Object.fromEntries(request.headers),
    },
  });
  let setCookie: string | null = null;
  if (!session.data) {
    await authClient.signIn.anonymous({
      fetchOptions: {
        onSuccess(context) {
          setCookie = context.response.headers.get("set-cookie");
        },
      },
    });
  }
  const response = await next();
  if (setCookie) {
    request.headers.append("set-cookie", setCookie);
  }
  return response;
});
