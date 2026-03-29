import { API_URL } from "$env/static/private";

import type { RequestHandler } from "./$types";

const FORWARDED_HEADERS_DENYLIST = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
]);

function forwardHeaders(headers: Headers): Headers {
  const forwarded = new Headers();
  for (const [key, value] of headers) {
    if (!FORWARDED_HEADERS_DENYLIST.has(key)) {
      forwarded.set(key, value);
    }
  }
  return forwarded;
}

const handler: RequestHandler = async ({ request }) => {
  const { pathname, search } = new URL(request.url);

  const response = await fetch(new URL(pathname + search, API_URL), {
    method: request.method,
    body: request.body,
    headers: forwardHeaders(request.headers),
    // @ts-expect-error -- required for streaming request bodies
    duplex: "half",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
