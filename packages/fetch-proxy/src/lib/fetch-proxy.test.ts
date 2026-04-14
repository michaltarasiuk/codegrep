import { describe, expect, it } from "vitest";

import { createFetchProxy, type FetchProxyOptions } from "./fetch-proxy.js";

function createProxy(
  { init, input }: { input: URL | RequestInfo; init?: RequestInit },
  options?: FetchProxyOptions
) {
  return async (target: string | URL) => {
    let request!: Request;
    let response!: Response;

    const proxy = createFetchProxy(target, {
      ...options,
      fetch(input, init) {
        request = new Request(input, init);
        return options?.fetch?.(input, init) ?? Promise.resolve(new Response());
      },
    });
    response = await proxy(input, init);

    return {
      request,
      response,
    };
  };
}

describe("fetch proxy", () => {
  it("appends the request URL pathname + search to the target URL", async () => {
    const { request: request1 } = await createProxy({
      input: "http://example.com",
    })("https://proxy.example.test/upstream");

    expect(request1.url).toBe("https://proxy.example.test/upstream");

    const { request: request2 } = await createProxy({
      input: "http://example.com/?q=test",
    })("https://proxy.example.test/upstream");

    expect(request2.url).toBe("https://proxy.example.test/upstream?q=test");

    const { request: request3 } = await createProxy({
      input: "http://example.com/search?q=test",
    })("https://proxy.example.test/");

    expect(request3.url).toBe("https://proxy.example.test/search?q=test");
    const { request: request4 } = await createProxy({
      input: "http://example.com/search?q=test",
    })("https://proxy.example.test/upstream");

    expect(request4.url).toBe(
      "https://proxy.example.test/upstream/search?q=test"
    );
  });

  it("forwards request method, headers, and body", async () => {
    const { request } = await createProxy({
      input: "http://example.com/search?q=test",
      init: {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: "hello",
      },
    })("https://proxy.example.test/upstream");

    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBe("text/plain");
    expect(await request.text()).toBe("hello");
  });

  it("forwards an empty request body", async () => {
    const { request } = await createProxy({
      input: "http://example.com/search?q=test",
      init: {
        method: "POST",
      },
    })("https://proxy.example.test/upstream");

    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBeNull();
    expect(await request.text()).toBe("");
  });

  it("does not append X-Forwarded-Proto and X-Forwarded-Host headers by default", async () => {
    const { request } = await createProxy({
      input: "http://example.com:8081/search?q=test",
    })("https://proxy.example.test/upstream");

    expect(request.headers.get("X-Forwarded-Proto")).toBeNull();
    expect(request.headers.get("X-Forwarded-Host")).toBeNull();
  });

  it("appends X-Forwarded-Proto and X-Forwarded-Host headers when desired", async () => {
    const { request } = await createProxy(
      {
        input: "http://example.com:8081/search?q=test",
      },
      {
        xForwardedHeaders: true,
      }
    )("https://proxy.example.test/upstream");

    expect(request.headers.get("X-Forwarded-Proto")).toBe("http");
    expect(request.headers.get("X-Forwarded-Host")).toBe("example.com:8081");
  });

  it("forwards additional request init options", async () => {
    const { request } = await createProxy({
      input: "http://example.com/search?q=test",
      init: {
        cache: "no-cache",
        credentials: "include",
        redirect: "manual",
      },
    })("https://proxy.example.test/upstream");

    expect(request.cache).toBe("no-cache");
    expect(request.credentials).toBe("include");
    expect(request.redirect).toBe("manual");
  });
});
