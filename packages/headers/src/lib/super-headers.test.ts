import { describe, expect, it } from "vitest";

import { Accept } from "./accept.js";
import { AcceptEncoding } from "./accept-encoding.js";
import { AcceptLanguage } from "./accept-language.js";
import { CacheControl } from "./cache-control.js";
import { ContentDisposition } from "./content-disposition.js";
import { ContentType } from "./content-type.js";
import { Cookie } from "./cookie.js";
import { IfNoneMatch } from "./if-none-match.js";
import { SuperHeaders } from "./super-headers.js";

describe("SuperHeaders", () => {
  it("is an instance of Headers", () => {
    let headers = new SuperHeaders();
    expect(headers).toBeInstanceOf(SuperHeaders);
    expect(headers).toBeInstanceOf(Headers);
  });

  it("initializes with no arguments", () => {
    let headers = new SuperHeaders();
    expect(headers.get("Content-Type")).toBeNull();
  });

  it("initializes from an object of header name/value pairs", () => {
    let headers = new SuperHeaders({ "Content-Type": "text/plain" });
    expect(headers.get("Content-Type")).toBe("text/plain");
  });

  it("initializes from an array of key-value pairs", () => {
    let headers = new SuperHeaders([
      ["Content-Type", "text/plain"],
      ["X-Custom", "value"],
    ]);
    expect(headers.get("Content-Type")).toBe("text/plain");
    expect(headers.get("X-Custom")).toBe("value");
  });

  it("initializes from a Headers instance", () => {
    let h1 = new Headers({ "Content-Type": "text/plain" });
    let h2 = new SuperHeaders(h1);
    expect(h2.get("Content-Type")).toBe("text/plain");
  });

  it("initializes from another SuperHeaders instance", () => {
    let h1 = new SuperHeaders({ "Content-Type": "text/plain" });
    let h2 = new SuperHeaders(h1);
    expect(h2.get("Content-Type")).toBe("text/plain");
  });

  it("initializes from a string", () => {
    let headers = new SuperHeaders(
      "Content-Type: text/plain\r\nContent-Length: 42"
    );
    expect(headers.get("Content-Type")).toBe("text/plain");
    expect(headers.get("Content-Length")).toBe("42");
  });

  it("appends values", () => {
    let headers = new SuperHeaders();
    headers.append("X-Custom", "value1");
    headers.append("X-Custom", "value2");
    expect(headers.get("X-Custom")).toBe("value1, value2");
  });

  it("sets values", () => {
    let headers = new SuperHeaders();
    headers.set("X-Custom", "value1");
    headers.set("X-Custom", "value2");
    expect(headers.get("X-Custom")).toBe("value2");
  });

  it("deletes values", () => {
    let headers = new SuperHeaders({ "X-Custom": "value" });
    headers.delete("X-Custom");
    expect(headers.has("X-Custom")).toBe(false);
  });

  it("checks if a header exists", () => {
    let headers = new SuperHeaders({ "X-Custom": "value" });
    expect(headers.has("X-Custom")).toBe(true);
    expect(headers.has("Content-Type")).toBe(false);

    // Accessing this property should not change the result of has()
    let _ = headers.contentType;
    expect(headers.has("Content-Type")).toBe(false);
  });

  it("iterates over entries", () => {
    let headers = new SuperHeaders({
      "Content-Type": "text/plain",
      "Content-Length": "42",
    });
    let entries = Array.from(headers.entries());
    expect(entries).toEqual([
      ["content-type", "text/plain"],
      ["content-length", "42"],
    ]);
  });

  it("iterates over keys", () => {
    let headers = new SuperHeaders({
      "Content-Type": "text/plain",
      "Content-Length": "42",
    });
    let keys = Array.from(headers.keys());
    expect(keys).toEqual(["content-type", "content-length"]);
  });

  it("iterates over set-cookie keys correctly", () => {
    let headers = new SuperHeaders();
    headers.append("Set-Cookie", "session=abc");
    headers.append("Set-Cookie", "theme=dark");
    let keys = Array.from(headers.keys());
    expect(keys).toEqual(["set-cookie", "set-cookie"]);
  });

  it("iterates over values", () => {
    let headers = new SuperHeaders({
      "Content-Type": "text/plain",
      "Content-Length": "42",
    });
    let values = Array.from(headers.values());
    expect(values).toEqual(["text/plain", "42"]);
  });

  it("uses forEach correctly", () => {
    let headers = new SuperHeaders({
      "Content-Type": "text/plain",
      "Content-Length": "42",
    });
    let result: [string, string][] = [];
    headers.forEach((value, key) => {
      result.push([key, value]);
    });
    expect(result).toEqual([
      ["content-type", "text/plain"],
      ["content-length", "42"],
    ]);
  });

  it("is directly iterable", () => {
    let headers = new SuperHeaders({
      "Content-Type": "text/plain",
      "Content-Length": "42",
    });
    let entries = Array.from(headers);
    expect(entries).toEqual([
      ["content-type", "text/plain"],
      ["content-length", "42"],
    ]);
  });

  it("omits empty values when stringified", () => {
    let headers = new SuperHeaders();

    // This should appear in the string since it has a media type, it's complete
    headers.contentType = "text/plain";

    // This should not appear in the string since it's incomplete, missing the type
    headers.contentDisposition.filename = "example.txt";

    expect(headers.toString()).toBe("Content-Type: text/plain");
  });

  describe("constructor property init", () => {
    it("handles the accept property", () => {
      let headers = new SuperHeaders({
        accept: { "text/html": 1, "application/json": 0.9 },
      });
      expect(headers.get("Accept")).toBe("text/html,application/json;q=0.9");
    });

    it("handles the acceptEncoding property", () => {
      let headers = new SuperHeaders({
        acceptEncoding: { gzip: 1, deflate: 0.8 },
      });
      expect(headers.get("Accept-Encoding")).toBe("gzip,deflate;q=0.8");
    });

    it("handles the acceptLanguage property", () => {
      let headers = new SuperHeaders({
        acceptLanguage: { "en-US": 1, en: 0.9 },
      });
      expect(headers.get("Accept-Language")).toBe("en-us,en;q=0.9");
    });

    it("handles the acceptRanges property", () => {
      let headers = new SuperHeaders({ acceptRanges: "bytes" });
      expect(headers.get("Accept-Ranges")).toBe("bytes");
    });

    it("handles the age property", () => {
      let headers = new SuperHeaders({ age: 42 });
      expect(headers.get("Age")).toBe("42");
    });

    it("handles the cacheControl property", () => {
      let headers = new SuperHeaders({
        cacheControl: { public: true, maxAge: 3600 },
      });
      expect(headers.get("Cache-Control")).toBe("public, max-age=3600");
    });

    it("handles the connection property", () => {
      let headers = new SuperHeaders({ connection: "close" });
      expect(headers.get("Connection")).toBe("close");
    });

    it("handles the contentDisposition property", () => {
      let headers = new SuperHeaders({
        contentDisposition: { type: "attachment", filename: "example.txt" },
      });
      expect(headers.get("Content-Disposition")).toBe(
        "attachment; filename=example.txt"
      );
    });

    it("handles the contentEncoding property", () => {
      let headers = new SuperHeaders({ contentEncoding: "gzip" });
      expect(headers.get("Content-Encoding")).toBe("gzip");
    });

    it("handles the contentLanguage property", () => {
      let headers = new SuperHeaders({ contentLanguage: "en-US" });
      expect(headers.get("Content-Language")).toBe("en-US");
    });

    it("handles the contentLength property", () => {
      let headers = new SuperHeaders({ contentLength: 42 });
      expect(headers.get("Content-Length")).toBe("42");
    });

    it("handles the contentType property", () => {
      let headers = new SuperHeaders({
        contentType: { mediaType: "text/plain", charset: "utf-8" },
      });
      expect(headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    });

    it("handles the cookie property", () => {
      let headers = new SuperHeaders({ cookie: [["name", "value"]] });
      expect(headers.get("Cookie")).toBe("name=value");
    });

    it("handles the date property", () => {
      let headers = new SuperHeaders({
        date: new Date("2021-01-01T00:00:00Z"),
      });
      expect(headers.get("Date")).toBe("Fri, 01 Jan 2021 00:00:00 GMT");
    });

    it("handles the etag property", () => {
      let headers = new SuperHeaders({ etag: '"67ab43"' });
      expect(headers.get("ETag")).toBe('"67ab43"');

      let headers2 = new SuperHeaders({ etag: "67ab43" });
      expect(headers2.get("ETag")).toBe('"67ab43"');

      let headers3 = new SuperHeaders({ etag: 'W/"67ab43"' });
      expect(headers3.get("ETag")).toBe('W/"67ab43"');
    });

    it("handles the expires property", () => {
      let headers = new SuperHeaders({
        expires: new Date("2021-01-01T00:00:00Z"),
      });
      expect(headers.get("Expires")).toBe("Fri, 01 Jan 2021 00:00:00 GMT");
    });

    it("handles the host property", () => {
      let headers = new SuperHeaders({ host: "example.com" });
      expect(headers.get("Host")).toBe("example.com");
    });

    it("handles the ifModifiedSince property", () => {
      let headers = new SuperHeaders({
        ifModifiedSince: new Date("2021-01-01T00:00:00Z"),
      });
      expect(headers.get("If-Modified-Since")).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );
    });

    it("handles the ifNoneMatch property", () => {
      let headers = new SuperHeaders({ ifNoneMatch: ["67ab43", "54ed21"] });
      expect(headers.get("If-None-Match")).toBe('"67ab43", "54ed21"');
    });

    it("handles the ifUnmodifiedSince property", () => {
      let headers = new SuperHeaders({
        ifUnmodifiedSince: new Date("2021-01-01T00:00:00Z"),
      });
      expect(headers.get("If-Unmodified-Since")).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );
    });

    it("handles the lastModified property", () => {
      let headers = new SuperHeaders({
        lastModified: new Date("2021-01-01T00:00:00Z"),
      });
      expect(headers.get("Last-Modified")).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );
    });

    it("handles the location property", () => {
      let headers = new SuperHeaders({ location: "https://example.com" });
      expect(headers.get("Location")).toBe("https://example.com");
    });

    it("handles the referer property", () => {
      let headers = new SuperHeaders({ referer: "https://example.com" });
      expect(headers.get("Referer")).toBe("https://example.com");
    });

    it("handles the setCookie property", () => {
      let headers = new SuperHeaders({
        setCookie: [
          { name: "session", value: "abc", path: "/" },
          {
            name: "theme",
            value: "dark",
            expires: new Date("2021-12-31T23:59:59Z"),
          },
        ],
      });
      expect(headers.getSetCookie()).toEqual([
        "session=abc; Path=/",
        "theme=dark; Expires=Fri, 31 Dec 2021 23:59:59 GMT",
      ]);
    });

    it("stringifies unknown properties with non-string values", () => {
      let headers = new SuperHeaders({ unknown: 42 });
      expect(headers.get("Unknown")).toBe("42");
    });
  });

  describe("property getters and setters", () => {
    it("supports the accept property", () => {
      let headers = new SuperHeaders();

      expect(headers.accept).toBeInstanceOf(Accept);

      headers.accept = "text/html,application/json;q=0.9";
      expect(headers.accept.size).toBe(2);
      expect(headers.accept.mediaTypes).toEqual([
        "text/html",
        "application/json",
      ]);
      expect(headers.accept.weights).toEqual([1, 0.9]);

      headers.accept = { "application/json": 0.8, "text/html": 1 };
      expect(headers.accept.size).toBe(2);
      expect(headers.accept.mediaTypes).toEqual([
        "text/html",
        "application/json",
      ]);
      expect(headers.accept.weights).toEqual([1, 0.8]);

      headers.accept = null;
      expect(headers.accept).toBeInstanceOf(Accept);
      expect(headers.accept.toString()).toBe("");
    });

    it("supports the acceptEncoding property", () => {
      let headers = new SuperHeaders();

      expect(headers.acceptEncoding).toBeInstanceOf(AcceptEncoding);

      headers.acceptEncoding = "gzip, deflate";
      expect(headers.acceptEncoding.size).toBe(2);
      expect(headers.acceptEncoding.encodings).toEqual(["gzip", "deflate"]);
      expect(headers.acceptEncoding.weights).toEqual([1, 1]);

      headers.acceptEncoding = { gzip: 1, deflate: 0.8 };
      expect(headers.acceptEncoding.size).toBe(2);
      expect(headers.acceptEncoding.encodings).toEqual(["gzip", "deflate"]);
      expect(headers.acceptEncoding.weights).toEqual([1, 0.8]);

      headers.acceptEncoding = null;
      expect(headers.acceptEncoding).toBeInstanceOf(AcceptEncoding);
      expect(headers.acceptEncoding.toString()).toBe("");
    });

    it("supports the acceptLanguage property", () => {
      let headers = new SuperHeaders();

      expect(headers.acceptLanguage).toBeInstanceOf(AcceptLanguage);

      headers.acceptLanguage = "en-US,en;q=0.9";
      expect(headers.acceptLanguage.size).toBe(2);
      expect(headers.acceptLanguage.languages).toEqual(["en-us", "en"]);
      expect(headers.acceptLanguage.weights).toEqual([1, 0.9]);

      headers.acceptLanguage = { en: 1, "en-US": 0.8 };
      expect(headers.acceptLanguage.size).toBe(2);
      expect(headers.acceptLanguage.languages).toEqual(["en", "en-us"]);
      expect(headers.acceptLanguage.weights).toEqual([1, 0.8]);

      headers.acceptLanguage = null;
      expect(headers.acceptLanguage).toBeInstanceOf(AcceptLanguage);
      expect(headers.acceptLanguage.toString()).toBe("");
    });

    it("supports the acceptRanges property", () => {
      let headers = new SuperHeaders();

      expect(headers.acceptRanges).toBeNull();

      headers.acceptRanges = "bytes";
      expect(headers.acceptRanges).toBe("bytes");

      headers.acceptRanges = null;
      expect(headers.acceptRanges).toBeNull();
    });

    it("supports the age property", () => {
      let headers = new SuperHeaders();

      expect(headers.age).toBeNull();

      headers.age = "42";
      expect(headers.age).toBe(42);

      headers.age = 42;
      expect(headers.age).toBe(42);

      headers.age = null;
      expect(headers.age).toBeNull();
    });

    it("supports the cacheControl property", () => {
      let headers = new SuperHeaders();

      expect(headers.cacheControl).toBeInstanceOf(CacheControl);

      headers.cacheControl = "public, max-age=3600";
      expect(headers.cacheControl.public).toBe(true);
      expect(headers.cacheControl.maxAge).toBe(3600);

      headers.cacheControl.maxAge = 1800;
      expect(headers.cacheControl.maxAge).toBe(1800);

      headers.cacheControl = { noCache: true, noStore: true };
      expect(headers.cacheControl.noCache).toBe(true);
      expect(headers.cacheControl.noStore).toBe(true);

      headers.cacheControl = null;
      expect(headers.cacheControl).toBeInstanceOf(CacheControl);
      expect(headers.cacheControl.toString()).toBe("");
    });

    it("supports the connection property", () => {
      let headers = new SuperHeaders();

      expect(headers.connection).toBeNull();

      headers.connection = "close";
      expect(headers.connection).toBe("close");

      headers.connection = null;
      expect(headers.connection).toBeNull();
    });

    it("supports the contentDisposition property", () => {
      let headers = new SuperHeaders();

      expect(headers.contentDisposition).toBeInstanceOf(ContentDisposition);

      headers.contentDisposition = 'attachment; filename="example.txt"';
      expect(headers.contentDisposition.type).toBe("attachment");
      expect(headers.contentDisposition.filename).toBe("example.txt");

      headers.contentDisposition.filename = "new.txt";
      expect(headers.contentDisposition.filename).toBe("new.txt");

      headers.contentDisposition = { type: "inline", filename: "index.html" };
      expect(headers.contentDisposition.type).toBe("inline");
      expect(headers.contentDisposition.filename).toBe("index.html");

      headers.contentDisposition = null;
      expect(headers.contentDisposition).toBeInstanceOf(ContentDisposition);
      expect(headers.contentDisposition.toString()).toBe("");
    });

    it("supports the contentEncoding property", () => {
      let headers = new SuperHeaders();

      expect(headers.contentEncoding).toBeNull();

      headers.contentEncoding = "gzip";
      expect(headers.contentEncoding).toBe("gzip");

      headers.contentEncoding = ["deflate", "gzip"];
      expect(headers.contentEncoding).toBe("deflate, gzip");

      headers.contentEncoding = null;
      expect(headers.contentEncoding).toBeNull();
    });

    it("supports the contentLanguage property", () => {
      let headers = new SuperHeaders();

      expect(headers.contentLanguage).toBeNull();

      headers.contentLanguage = "en-US";
      expect(headers.contentLanguage).toBe("en-US");

      headers.contentLanguage = ["en", "fr"];
      expect(headers.contentLanguage).toBe("en, fr");

      headers.contentLanguage = null;
      expect(headers.contentLanguage).toBeNull();
    });

    it("supports the contentLength property", () => {
      let headers = new SuperHeaders();

      expect(headers.contentLength).toBeNull();

      headers.contentLength = "42";
      expect(headers.contentLength).toBe(42);

      headers.contentLength = 42;
      expect(headers.contentLength).toBe(42);

      headers.contentLength = null;
      expect(headers.contentLength).toBeNull();
    });

    it("supports the contentType property", () => {
      let headers = new SuperHeaders();

      expect(headers.contentType).toBeInstanceOf(ContentType);

      headers.contentType = "text/plain; charset=utf-8";
      expect(headers.contentType.mediaType).toBe("text/plain");
      expect(headers.contentType.charset).toBe("utf-8");

      headers.contentType.charset = "iso-8859-1";
      expect(headers.contentType.charset).toBe("iso-8859-1");

      headers.contentType = { mediaType: "text/html" };
      expect(headers.contentType.mediaType).toBe("text/html");

      headers.contentType = null;
      expect(headers.contentType).toBeInstanceOf(ContentType);
      expect(headers.contentType.toString()).toBe("");
    });

    it("supports the cookie property", () => {
      let headers = new SuperHeaders();

      expect(headers.cookie).toBeInstanceOf(Cookie);

      headers.cookie = "name1=value1; name2=value2";
      expect(headers.cookie.get("name1")).toBe("value1");
      expect(headers.cookie.get("name2")).toBe("value2");

      headers.cookie.set("name3", "value3");
      expect(headers.cookie.get("name3")).toBe("value3");

      headers.cookie = [["name4", "value4"]];
      expect(headers.cookie.get("name4")).toBe("value4");

      headers.cookie = null;
      expect(headers.cookie).toBeInstanceOf(Cookie);
      expect(headers.cookie.toString()).toBe("");
    });

    it("supports the date property", () => {
      let headers = new SuperHeaders();

      expect(headers.date).toBeNull();

      headers.date = new Date("2021-01-01T00:00:00Z");
      expect(headers.date).toBeInstanceOf(Date);
      expect(headers.date.toUTCString()).toBe("Fri, 01 Jan 2021 00:00:00 GMT");

      headers.date = null;
      expect(headers.date).toBeNull();
    });

    it("supports the etag property", () => {
      let headers = new SuperHeaders();

      expect(headers.etag).toBeNull();

      headers.etag = '"67ab43"';
      expect(headers.etag).toBe('"67ab43"');

      headers.etag = "67ab43";
      expect(headers.etag).toBe('"67ab43"');

      headers.etag = 'W/"67ab43"';
      expect(headers.etag).toBe('W/"67ab43"');

      headers.etag = "";
      expect(headers.etag).toBe('""');

      headers.etag = '""';
      expect(headers.etag).toBe('""');

      headers.etag = null;
      expect(headers.etag).toBeNull();
    });

    it("supports the expires property", () => {
      let headers = new SuperHeaders();

      expect(headers.expires).toBeNull();

      headers.expires = new Date("2021-01-01T00:00:00Z");
      expect(headers.expires).toBeInstanceOf(Date);
      expect(headers.expires.toUTCString()).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );

      headers.expires = null;
      expect(headers.expires).toBeNull();
    });

    it("supports the host property", () => {
      let headers = new SuperHeaders();

      expect(headers.host).toBeNull();

      headers.host = "example.com";
      expect(headers.host).toBe("example.com");

      headers.host = null;
      expect(headers.host).toBeNull();
    });

    it("supports the ifModifiedSince property", () => {
      let headers = new SuperHeaders();

      expect(headers.ifModifiedSince).toBeNull();

      headers.ifModifiedSince = new Date("2021-01-01T00:00:00Z");
      expect(headers.ifModifiedSince).toBeInstanceOf(Date);
      expect(headers.ifModifiedSince.toUTCString()).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );

      headers.ifModifiedSince = null;
      expect(headers.ifModifiedSince).toBeNull();
    });

    it("supports the ifNoneMatch property", () => {
      let headers = new SuperHeaders();

      expect(headers.ifNoneMatch).toBeInstanceOf(IfNoneMatch);

      headers.ifNoneMatch = '"67ab43", "54ed21"';
      expect(headers.ifNoneMatch.tags).toEqual(['"67ab43"', '"54ed21"']);

      headers.ifNoneMatch = ["67ab43", "54ed21"];
      expect(headers.ifNoneMatch.tags).toEqual(['"67ab43"', '"54ed21"']);

      headers.ifNoneMatch = { tags: ["67ab43", "54ed21"] };
      expect(headers.ifNoneMatch.tags).toEqual(['"67ab43"', '"54ed21"']);

      headers.ifNoneMatch = null;
      expect(headers.ifNoneMatch).toBeInstanceOf(IfNoneMatch);
      expect(headers.ifNoneMatch.toString()).toBe("");
    });

    it("supports the ifUnmodifiedSince property", () => {
      let headers = new SuperHeaders();

      expect(headers.ifUnmodifiedSince).toBeNull();

      headers.ifUnmodifiedSince = new Date("2021-01-01T00:00:00Z");
      expect(headers.ifUnmodifiedSince).toBeInstanceOf(Date);
      expect(headers.ifUnmodifiedSince.toUTCString()).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );

      headers.ifUnmodifiedSince = null;
      expect(headers.ifUnmodifiedSince).toBeNull();
    });

    it("supports the lastModified property", () => {
      let headers = new SuperHeaders();

      expect(headers.lastModified).toBeNull();

      headers.lastModified = new Date("2021-01-01T00:00:00Z");
      expect(headers.lastModified).toBeInstanceOf(Date);
      expect(headers.lastModified.toUTCString()).toBe(
        "Fri, 01 Jan 2021 00:00:00 GMT"
      );

      headers.lastModified = null;
      expect(headers.lastModified).toBeNull();
    });

    it("supports the location property", () => {
      let headers = new SuperHeaders();

      expect(headers.location).toBeNull();

      headers.location = "https://example.com";
      expect(headers.location).toBe("https://example.com");

      headers.location = null;
      expect(headers.location).toBeNull();
    });

    it("supports the referer property", () => {
      let headers = new SuperHeaders();

      expect(headers.referer).toBeNull();

      headers.referer = "https://example.com";
      expect(headers.referer).toBe("https://example.com");

      headers.referer = null;
      expect(headers.referer).toBeNull();
    });

    it("supports the setCookie property", () => {
      let headers = new SuperHeaders();

      expect(headers.setCookie).toEqual([]);

      headers.setCookie = "session=abc";
      expect(headers.setCookie.length).toBe(1);
      expect(headers.setCookie[0]!.name).toBe("session");
      expect(headers.setCookie[0]!.value).toBe("abc");

      headers.setCookie = { name: "session", value: "def" };
      expect(headers.setCookie.length).toBe(1);
      expect(headers.setCookie[0]!.name).toBe("session");
      expect(headers.setCookie[0]!.value).toBe("def");

      headers.setCookie = ["session=abc", "theme=dark"];
      expect(headers.setCookie.length).toBe(2);
      expect(headers.setCookie[0]!.name).toBe("session");
      expect(headers.setCookie[0]!.value).toBe("abc");
      expect(headers.setCookie[1]!.name).toBe("theme");
      expect(headers.setCookie[1]!.value).toBe("dark");

      // Can use ...spread to add new cookies
      headers.setCookie = [...headers.setCookie, "lang=en"];
      expect(headers.setCookie.length).toBe(3);
      expect(headers.setCookie[2]!.name).toBe("lang");
      expect(headers.setCookie[2]!.value).toBe("en");

      headers.setCookie = [
        { name: "session", value: "def" },
        { name: "theme", value: "light" },
      ];
      expect(headers.setCookie.length).toBe(2);
      expect(headers.setCookie[0]!.name).toBe("session");
      expect(headers.setCookie[0]!.value).toBe("def");
      expect(headers.setCookie[1]!.name).toBe("theme");
      expect(headers.setCookie[1]!.value).toBe("light");

      // Can use push() to add new cookies
      headers.setCookie.push({ name: "lang", value: "fr" });
      expect(headers.setCookie.length).toBe(3);
      expect(headers.setCookie[2]!.name).toBe("lang");
      expect(headers.setCookie[2]!.value).toBe("fr");

      headers.setCookie = null;
      expect(headers.setCookie).toEqual([]);
    });
  });
});
