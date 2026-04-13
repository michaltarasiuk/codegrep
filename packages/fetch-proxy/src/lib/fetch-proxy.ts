export interface FetchProxyOptions {
  /**
   * The `fetch` function to use for the actual fetch. Defaults to the global `fetch` function.
   */
  fetch?: typeof globalThis.fetch;
  /**
   * Set `true` to add `X-Forwarded-Proto` and `X-Forwarded-Host` headers to the proxied request.
   * Defaults to `false`.
   */
  xForwardedHeaders?: boolean;
}

/**
 * A [`fetch` function](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
 * that forwards requests to another server.
 */
export interface FetchProxy {
  (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
}

/**
 * Creates a `fetch` function that forwards requests to another server.
 * @param target The URL of the server to proxy requests to
 * @param options Options to customize the behavior of the proxy
 * @returns A fetch function that forwards requests to the target server
 */
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
      // init.duplex = 'half' must be set when body is a ReadableStream, and Node follows the spec.
      // However, this property is not defined in the TypeScript types for RequestInit, so we have
      // to cast it here in order to set it without a type error.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex
      (proxyInit as { duplex: "half" }).duplex = "half";
    }

    const response = await localFetch(proxyUrl, proxyInit);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}
