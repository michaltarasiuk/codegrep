import { describe, expect, it } from "vitest";

import { canonicalHeaderName } from "./header-names.js";

describe("normalizeHeaderName", () => {
  it("handles common headers correctly", () => {
    expect(canonicalHeaderName("content-type")).toBe("Content-Type");
    expect(canonicalHeaderName("content-length")).toBe("Content-Length");
    expect(canonicalHeaderName("user-agent")).toBe("User-Agent");
    expect(canonicalHeaderName("accept")).toBe("Accept");
  });

  it("handles special case headers correctly", () => {
    expect(canonicalHeaderName("etag")).toBe("ETag");
    expect(canonicalHeaderName("www-authenticate")).toBe("WWW-Authenticate");
    expect(canonicalHeaderName("x-forwarded-for")).toBe("X-Forwarded-For");
    expect(canonicalHeaderName("x-xss-protection")).toBe("X-XSS-Protection");
    expect(canonicalHeaderName("te")).toBe("TE");
    expect(canonicalHeaderName("expect-ct")).toBe("Expect-CT");
  });

  it("normalizes mixed-case input", () => {
    expect(canonicalHeaderName("CoNtEnT-TyPe")).toBe("Content-Type");
    expect(canonicalHeaderName("x-FoRwArDeD-fOr")).toBe("X-Forwarded-For");
  });

  it("handles single-word headers", () => {
    expect(canonicalHeaderName("authorization")).toBe("Authorization");
    expect(canonicalHeaderName("host")).toBe("Host");
  });

  it("normalizes other common HTTP headers", () => {
    expect(canonicalHeaderName("accept-charset")).toBe("Accept-Charset");
    expect(canonicalHeaderName("accept-encoding")).toBe("Accept-Encoding");
    expect(canonicalHeaderName("accept-language")).toBe("Accept-Language");
    expect(canonicalHeaderName("cache-control")).toBe("Cache-Control");
    expect(canonicalHeaderName("connection")).toBe("Connection");
    expect(canonicalHeaderName("cookie")).toBe("Cookie");
    expect(canonicalHeaderName("date")).toBe("Date");
    expect(canonicalHeaderName("expect")).toBe("Expect");
    expect(canonicalHeaderName("forwarded")).toBe("Forwarded");
    expect(canonicalHeaderName("from")).toBe("From");
    expect(canonicalHeaderName("if-match")).toBe("If-Match");
    expect(canonicalHeaderName("if-modified-since")).toBe("If-Modified-Since");
    expect(canonicalHeaderName("if-none-match")).toBe("If-None-Match");
    expect(canonicalHeaderName("if-range")).toBe("If-Range");
    expect(canonicalHeaderName("if-unmodified-since")).toBe(
      "If-Unmodified-Since"
    );
    expect(canonicalHeaderName("max-forwards")).toBe("Max-Forwards");
    expect(canonicalHeaderName("origin")).toBe("Origin");
    expect(canonicalHeaderName("pragma")).toBe("Pragma");
    expect(canonicalHeaderName("proxy-authorization")).toBe(
      "Proxy-Authorization"
    );
    expect(canonicalHeaderName("range")).toBe("Range");
    expect(canonicalHeaderName("referer")).toBe("Referer");
    expect(canonicalHeaderName("server")).toBe("Server");
    expect(canonicalHeaderName("transfer-encoding")).toBe("Transfer-Encoding");
    expect(canonicalHeaderName("upgrade")).toBe("Upgrade");
    expect(canonicalHeaderName("via")).toBe("Via");
    expect(canonicalHeaderName("warning")).toBe("Warning");
    expect(canonicalHeaderName("alt-svc")).toBe("Alt-Svc");
    expect(canonicalHeaderName("content-disposition")).toBe(
      "Content-Disposition"
    );
    expect(canonicalHeaderName("content-encoding")).toBe("Content-Encoding");
    expect(canonicalHeaderName("content-language")).toBe("Content-Language");
    expect(canonicalHeaderName("content-location")).toBe("Content-Location");
    expect(canonicalHeaderName("content-range")).toBe("Content-Range");
    expect(canonicalHeaderName("link")).toBe("Link");
    expect(canonicalHeaderName("location")).toBe("Location");
    expect(canonicalHeaderName("retry-after")).toBe("Retry-After");
    expect(canonicalHeaderName("strict-transport-security")).toBe(
      "Strict-Transport-Security"
    );
    expect(canonicalHeaderName("vary")).toBe("Vary");
  });

  it("handles custom X- headers", () => {
    expect(canonicalHeaderName("x-custom-header")).toBe("X-Custom-Header");
    expect(canonicalHeaderName("x-requested-with")).toBe("X-Requested-With");
  });

  it("preserves casing for unknown acronyms", () => {
    expect(canonicalHeaderName("x-csrf-token")).toBe("X-Csrf-Token");
    expect(canonicalHeaderName("x-api-key")).toBe("X-Api-Key");
  });
});
