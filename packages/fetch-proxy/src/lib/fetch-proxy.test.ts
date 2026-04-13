import { describe, expect, it } from "vitest";

import { createFetchProxy, type FetchProxyOptions } from "./fetch-proxy.js";

async function testProxy(
  input: URL | RequestInfo,
  init: RequestInit | undefined,
  target: string | URL,
  options?: FetchProxyOptions
): Promise<{ request: Request; response: Response }> {
  let request!: Request;
  const proxy = createFetchProxy(target, {
    ...options,
    fetch(input, init) {
      request = new Request(input, init);
      return options?.fetch?.(input, init) ?? Promise.resolve(new Response());
    },
  });

  const response = await proxy(input, init);

  expect(request).toBeDefined();

  return { request, response };
}

describe("fetch proxy", () => {
  it("appends the request URL pathname + search to the target URL", async () => {
    const { request: request1 } = await testProxy(
      "http://example.com",
      undefined,
      "https://proxy.example.test/rsc"
    );

    expect(request1.url).toBe("https://proxy.example.test/rsc");

    const { request: request2 } = await testProxy(
      "http://example.com/?q=remix",
      undefined,
      "https://proxy.example.test/rsc"
    );

    expect(request2.url).toBe("https://proxy.example.test/rsc?q=remix");

    const { request: request3 } = await testProxy(
      "http://example.com/search?q=remix",
      undefined,
      "https://proxy.example.test/"
    );

    expect(request3.url).toBe("https://proxy.example.test/search?q=remix");

    const { request: request4 } = await testProxy(
      "http://example.com/search?q=remix",
      undefined,
      "https://proxy.example.test/rsc"
    );

    expect(request4.url).toBe("https://proxy.example.test/rsc/search?q=remix");
  });

  it("forwards request method, headers, and body", async () => {
    const { request } = await testProxy(
      "http://example.com/search?q=remix",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: "hello",
      },
      "https://proxy.example.test/rsc"
    );

    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBe("text/plain");
    expect(await request.text()).toBe("hello");
  });

  it("forwards an empty request body", async () => {
    const { request } = await testProxy(
      "http://example.com/search?q=remix",
      {
        method: "POST",
      },
      "https://proxy.example.test/rsc"
    );

    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBeNull();
    expect(await request.text()).toBe("");
  });

  it("does not append X-Forwarded-Proto and X-Forwarded-Host headers by default", async () => {
    const { request } = await testProxy(
      "http://example.com:8081/search?q=remix",
      undefined,
      "https://proxy.example.test/rsc"
    );

    expect(request.headers.get("X-Forwarded-Proto")).toBeNull();
    expect(request.headers.get("X-Forwarded-Host")).toBeNull();
  });

  it("appends X-Forwarded-Proto and X-Forwarded-Host headers when desired", async () => {
    const { request } = await testProxy(
      "http://example.com:8081/search?q=remix",
      undefined,
      "https://proxy.example.test/rsc",
      {
        xForwardedHeaders: true,
      }
    );

    expect(request.headers.get("X-Forwarded-Proto")).toBe("http");
    expect(request.headers.get("X-Forwarded-Host")).toBe("example.com:8081");
  });

  it("forwards additional request init options", async () => {
    const { request } = await testProxy(
      "http://example.com/search?q=remix",
      {
        cache: "no-cache",
        credentials: "include",
        redirect: "manual",
      },
      "https://proxy.example.test/rsc"
    );

    expect(request.cache).toBe("no-cache");
    expect(request.credentials).toBe("include");
    expect(request.redirect).toBe("manual");
  });
});
