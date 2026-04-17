import { describe, expect, it } from "vitest";

import { CacheControl } from "./cache-control.js";

describe("CacheControl", () => {
  it("initializes with an empty string", () => {
    let header = new CacheControl("");
    expect(header.maxAge).toBeUndefined();
    expect(header.public).toBeUndefined();
    expect(`${header}`).toBe("");
  });

  it("initializes with a string", () => {
    let header = new CacheControl("public, max-age=3600, s-maxage=3600");
    expect(header.maxAge).toBe(3600);
    expect(header.sMaxage).toBe(3600);
    expect(header.public).toBe(true);
  });

  it("initializes with an object", () => {
    let header = new CacheControl({
      public: true,
      maxAge: 3600,
      sMaxage: 3600,
    });
    expect(header.maxAge).toBe(3600);
    expect(header.sMaxage).toBe(3600);
    expect(header.public).toBe(true);
  });

  it("initializes with another CacheControl", () => {
    let header = new CacheControl(
      new CacheControl("public, max-age=3600, s-maxage=3600")
    );
    expect(header.maxAge).toBe(3600);
    expect(header.sMaxage).toBe(3600);
    expect(header.public).toBe(true);
  });

  it("handles whitespace in initial value", () => {
    let header = new CacheControl(" public , max-age = 3600, s-maxage=3600 ");
    expect(header.maxAge).toBe(3600);
    expect(header.sMaxage).toBe(3600);
    expect(header.public).toBe(true);
  });

  it("sets and gets attributes", () => {
    let header = new CacheControl("");
    header.maxAge = 3600;
    header.sMaxage = 3600;
    header.public = true;
    expect(header.maxAge).toBe(3600);
    expect(header.sMaxage).toBe(3600);
    expect(header.public).toBe(true);
  });

  it("converts to a string properly", () => {
    let header = new CacheControl("public, max-age=3600, s-maxage=3600");
    expect(header.toString()).toBe("public, max-age=3600, s-maxage=3600");
  });

  it("sets numerical values to 0 instead of omitting them", () => {
    let header = new CacheControl();
    header.maxAge = 0;
    expect(header.toString()).toBe("max-age=0");
  });
});
