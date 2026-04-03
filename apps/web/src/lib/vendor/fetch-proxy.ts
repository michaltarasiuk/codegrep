// Ported from @mjackson/fetch-proxy (MIT)
// https://github.com/mjackson/remix-the-web/tree/main/packages/fetch-proxy

export interface FetchProxyOptions {
  fetch?: typeof globalThis.fetch;
  xForwardedHeaders?: boolean;
}

export interface FetchProxy {
  (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
}

export function createFetchProxy(
  target: string | URL,
  options?: FetchProxyOptions
): FetchProxy {
  const localFetch = options?.fetch ?? globalThis.fetch;
  const xForwardedHeaders = options?.xForwardedHeaders ?? false;

  const targetUrl = new URL(target);
  if (targetUrl.pathname.endsWith("/")) {
    targetUrl.pathname = targetUrl.pathname.replace(/\/+$/, "");
  }

  return async (input: URL | RequestInfo, init?: RequestInit) => {
    const request = new Request(input, init);
    const url = new URL(request.url);

    const proxyUrl = new URL(url.search, targetUrl);
    if (url.pathname !== "/") {
      proxyUrl.pathname =
        proxyUrl.pathname === "/"
          ? url.pathname
          : proxyUrl.pathname + url.pathname;
    }

    const proxyHeaders = new Headers(request.headers);
    if (xForwardedHeaders) {
      proxyHeaders.append("X-Forwarded-Proto", url.protocol.replace(/:$/, ""));
      proxyHeaders.append("X-Forwarded-Host", url.host);
    }

    const proxyInit: RequestInit = {
      ...init,
      method: request.method,
      headers: proxyHeaders,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      proxyInit.body = request.body;
      // @ts-expect-error -- required for streaming request bodies per fetch spec
      proxyInit.duplex = "half";
    }

    const response = await localFetch(proxyUrl, proxyInit);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}
