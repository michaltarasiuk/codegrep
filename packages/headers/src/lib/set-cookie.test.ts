import { describe, expect, it } from "vitest";

import { SetCookie } from "./set-cookie.js";

describe("SetCookie", () => {
  it("initializes with an empty string", () => {
    let header = new SetCookie("");
    expect(header.name).toBeUndefined();
    expect(header.value).toBeUndefined();
  });

  it("initializes with a string", () => {
    let header = new SetCookie(
      "session=abc123; Domain=example.com; Path=/; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly"
    );
    expect(header.name).toBe("session");
    expect(header.value).toBe("abc123");
    expect(header.domain).toBe("example.com");
    expect(header.path).toBe("/");
    expect(header.expires?.toUTCString()).toBe("Wed, 21 Oct 2015 07:28:00 GMT");
    expect(header.secure).toBe(true);
    expect(header.httpOnly).toBe(true);
  });

  it("initializes with an object", () => {
    let header = new SetCookie({
      name: "session",
      value: "abc123",
      domain: "example.com",
      path: "/",
      expires: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
      secure: true,
      httpOnly: true,
    });
    expect(header.name).toBe("session");
    expect(header.value).toBe("abc123");
    expect(header.domain).toBe("example.com");
    expect(header.path).toBe("/");
    expect(header.expires?.toUTCString()).toBe("Wed, 21 Oct 2015 07:28:00 GMT");
    expect(header.secure).toBe(true);
    expect(header.httpOnly).toBe(true);
  });

  it("initializes with another SetCookie", () => {
    let header = new SetCookie(
      new SetCookie(
        "session=abc123; Domain=example.com; Path=/; Secure; HttpOnly"
      )
    );
    expect(header.name).toBe("session");
    expect(header.value).toBe("abc123");
    expect(header.domain).toBe("example.com");
    expect(header.path).toBe("/");
    expect(header.secure).toBe(true);
    expect(header.httpOnly).toBe(true);
  });

  it("handles cookies without attributes", () => {
    let header = new SetCookie("user=john");
    expect(header.name).toBe("user");
    expect(header.value).toBe("john");
  });

  it("handles cookie values with commas", () => {
    let header = new SetCookie("list=apple,banana,cherry; Domain=example.com");
    expect(header.name).toBe("list");
    expect(header.value).toBe("apple,banana,cherry");
    expect(header.domain).toBe("example.com");
  });

  it("handles cookie values with semicolons", () => {
    let header = new SetCookie('complex="value; with; semicolons"; Path=/');
    expect(header.name).toBe("complex");
    expect(header.value).toBe("value; with; semicolons");
    expect(header.path).toBe("/");
  });

  it("handles cookie values with equals signs", () => {
    let header = new SetCookie('equation="1+1=2"; Secure');
    expect(header.name).toBe("equation");
    expect(header.value).toBe("1+1=2");
    expect(header.secure).toBe(true);
  });

  it("sets and gets attributes", () => {
    let header = new SetCookie("test=value");
    header.domain = "example.org";
    header.path = "/api";
    header.maxAge = 3600;
    header.secure = true;
    header.httpOnly = true;
    header.sameSite = "Strict";

    expect(header.domain).toBe("example.org");
    expect(header.path).toBe("/api");
    expect(header.maxAge).toBe(3600);
    expect(header.secure).toBe(true);
    expect(header.httpOnly).toBe(true);
    expect(header.sameSite).toBe("Strict");
  });

  it("converts to string correctly", () => {
    let header = new SetCookie("session=abc123");
    header.domain = "example.com";
    header.path = "/";
    header.secure = true;
    header.httpOnly = true;
    header.sameSite = "Lax";

    expect(header.toString()).toBe(
      "session=abc123; Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Lax"
    );
  });

  it("converts to an empty string when name is not set", () => {
    let header = new SetCookie();
    header.value = "test";
    expect(header.toString()).toBe("");
  });

  it("handles quoted values", () => {
    let header = new SetCookie('complex="quoted value; with semicolon"');
    expect(header.name).toBe("complex");
    expect(header.value).toBe("quoted value; with semicolon");
  });

  it("parses and formats expires attribute correctly", () => {
    let expiresDate = new Date("Wed, 21 Oct 2015 07:28:00 GMT");
    let header = new SetCookie(
      `test=value; Expires=${expiresDate.toUTCString()}`
    );
    expect(header.expires?.toUTCString()).toBe(expiresDate.toUTCString());

    header.expires = new Date("Thu, 22 Oct 2015 07:28:00 GMT");
    expect(header.toString()).toBe(
      "test=value; Expires=Thu, 22 Oct 2015 07:28:00 GMT"
    );
  });

  it("handles SameSite attribute case-insensitively", () => {
    let header = new SetCookie("test=value; SameSite=lax");
    expect(header.sameSite).toBe("Lax");

    header = new SetCookie("test=value; SameSite=STRICT");
    expect(header.sameSite).toBe("Strict");

    header = new SetCookie("test=value; SameSite=NoNe");
    expect(header.sameSite).toBe("None");
  });

  it("handles cookies with empty value", () => {
    let header = new SetCookie("name=");
    expect(header.name).toBe("name");
    expect(header.value).toBe("");
  });

  it("handles multiple identical attributes", () => {
    let header = new SetCookie("test=value; Path=/; Path=/api");
    expect(header.path).toBe("/api");
  });

  it("ignores unknown attributes", () => {
    let header = new SetCookie("test=value; Unknown=something");
    expect(header.toString()).toBe("test=value");
  });

  it("handles Max-Age as a number", () => {
    let header = new SetCookie("test=value; Max-Age=3600");
    expect(header.maxAge).toBe(3600);
  });

  it("ignores invalid Max-Age", () => {
    let header = new SetCookie("test=value; Max-Age=invalid");
    expect(header.maxAge).toBeUndefined();
  });

  it("handles missing value in attributes", () => {
    let header = new SetCookie("test=value; Domain=; Path");
    expect(header.domain).toBe("");
    expect(header.path).toBeUndefined();
  });

  it("preserves the case of the cookie name and value", () => {
    let header = new SetCookie("TestName=TestValue");
    expect(header.name).toBe("TestName");
    expect(header.value).toBe("TestValue");
  });

  it("handles setting new name and value", () => {
    let header = new SetCookie("old=value");
    header.name = "new";
    header.value = "newvalue";
    expect(header.toString()).toBe("new=newvalue");
  });

  it("correctly quotes values when necessary", () => {
    let header = new SetCookie("test=value");
    header.value = "need; quotes";
    expect(header.toString()).toBe('test="need; quotes"');
  });
});
