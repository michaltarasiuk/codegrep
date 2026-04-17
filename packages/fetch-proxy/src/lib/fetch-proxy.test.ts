import { describe, expect, it } from "vitest";

import { createFetchProxy, type FetchProxyOptions } from "./fetch-proxy.ts";

async function testProxy(
  input: URL | RequestInfo,
  init: RequestInit | undefined,
  target: string | URL,
  options?: FetchProxyOptions
): Promise<{ request: Request; response: Response }> {
  let request!: Request;
  let proxy = createFetchProxy(target, {
    ...options,
    fetch(input, init) {
      request = new Request(input, init);
      return options?.fetch?.(input, init) ?? Promise.resolve(new Response());
    },
  });

  let response = await proxy(input, init);

  expect(request).toBeDefined();

  return { request, response };
}

describe("fetch proxy", () => {
  it("appends the request URL pathname + search to the target URL", async () => {
    let { request: request1 } = await testProxy(
      "http://shopify.com",
      undefined,
      "https://remix.run:3000/rsc"
    );

    expect(request1.url).toBe("https://remix.run:3000/rsc");

    let { request: request2 } = await testProxy(
      "http://shopify.com/?q=remix",
      undefined,
      "https://remix.run:3000/rsc"
    );

    expect(request2.url).toBe("https://remix.run:3000/rsc?q=remix");

    let { request: request3 } = await testProxy(
      "http://shopify.com/search?q=remix",
      undefined,
      "https://remix.run:3000/"
    );

    expect(request3.url).toBe("https://remix.run:3000/search?q=remix");

    let { request: request4 } = await testProxy(
      "http://shopify.com/search?q=remix",
      undefined,
      "https://remix.run:3000/rsc"
    );

    expect(request4.url).toBe("https://remix.run:3000/rsc/search?q=remix");
  });

  it("forwards request method, headers, and body", async () => {
    let { request } = await testProxy(
      "http://shopify.com/search?q=remix",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: "hello",
      },
      "https://remix.run:3000/rsc"
    );

    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBe("text/plain");
    expect(await request.text()).toBe("hello");
  });

  it("forwards an empty request body", async () => {
    let { request } = await testProxy(
      "http://shopify.com/search?q=remix",
      {
        method: "POST",
      },
      "https://remix.run:3000/rsc"
    );

    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBeNull();
    expect(await request.text()).toBe("");
  });

  it("does not append X-Forwarded-Proto and X-Forwarded-Host headers by default", async () => {
    let { request } = await testProxy(
      "http://shopify.com:8080/search?q=remix",
      undefined,
      "https://remix.run:3000/rsc"
    );

    expect(request.headers.get("X-Forwarded-Proto")).toBeNull();
    expect(request.headers.get("X-Forwarded-Host")).toBeNull();
  });

  it("appends X-Forwarded-Proto and X-Forwarded-Host headers when desired", async () => {
    let { request } = await testProxy(
      "http://shopify.com:8080/search?q=remix",
      undefined,
      "https://remix.run:3000/rsc",
      {
        xForwardedHeaders: true,
      }
    );

    expect(request.headers.get("X-Forwarded-Proto")).toBe("http");
    expect(request.headers.get("X-Forwarded-Host")).toBe("shopify.com:8080");
  });

  it("forwards additional request init options", async () => {
    let { request } = await testProxy(
      "http://shopify.com/search?q=remix",
      {
        cache: "no-cache",
        credentials: "include",
        redirect: "manual",
      },
      "https://remix.run:3000/rsc"
    );

    expect(request.cache).toBe("no-cache");
    expect(request.credentials).toBe("include");
    expect(request.redirect).toBe("manual");
  });

  it("rewrites cookie domain and path", async () => {
    let { response } = await testProxy(
      "http://shopify.com/search?q=remix",
      undefined,
      "https://remix.run:3000/rsc",
      {
        async fetch() {
          return new Response(null, {
            headers: [
              [
                "Set-Cookie",
                "name=value; Domain=remix.run:3000; Path=/rsc/search",
              ],
              ["Set-Cookie", "name2=value2; Domain=remix.run:3000; Path=/rsc"],
            ],
          });
        },
      }
    );

    let setCookie = response.headers.getSetCookie();
    expect(setCookie).toBeDefined();
    expect(setCookie.length).toBe(2);
    expect(setCookie[0]).toBe("name=value; Domain=shopify.com; Path=/search");
    expect(setCookie[1]).toBe("name2=value2; Domain=shopify.com; Path=/");
  });

  it("does not rewrite cookie domain and path when opting-out", async () => {
    let { response } = await testProxy(
      "http://shopify.com/?q=remix",
      undefined,
      "https://remix.run:3000/rsc",
      {
        rewriteCookieDomain: false,
        rewriteCookiePath: false,
        async fetch() {
          return new Response(null, {
            headers: [
              [
                "Set-Cookie",
                "name=value; Domain=remix.run:3000; Path=/rsc/search",
              ],
              ["Set-Cookie", "name2=value2; Domain=remix.run:3000; Path=/rsc"],
            ],
          });
        },
      }
    );

    let setCookie = response.headers.getSetCookie();
    expect(setCookie).toBeDefined();
    expect(setCookie.length).toBe(2);
    expect(setCookie[0]).toBe(
      "name=value; Domain=remix.run:3000; Path=/rsc/search"
    );
    expect(setCookie[1]).toBe("name2=value2; Domain=remix.run:3000; Path=/rsc");
  });
});
