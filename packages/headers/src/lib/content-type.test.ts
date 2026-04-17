import { describe, expect, it } from "vitest";

import { ContentType } from "./content-type.js";

describe("ContentType", () => {
  it("initializes with an empty string", () => {
    let header = new ContentType("");
    expect(header.mediaType).toBeUndefined();
    expect(header.charset).toBeUndefined();
  });

  it("initializes with a string", () => {
    let header = new ContentType("text/plain; charset=utf-8");
    expect(header.mediaType).toBe("text/plain");
    expect(header.charset).toBe("utf-8");
  });

  it("initializes with an object", () => {
    let header = new ContentType({ mediaType: "text/plain", charset: "utf-8" });
    expect(header.mediaType).toBe("text/plain");
    expect(header.charset).toBe("utf-8");
  });

  it("initializes with another ContentType", () => {
    let header = new ContentType(new ContentType("text/plain; charset=utf-8"));
    expect(header.mediaType).toBe("text/plain");
    expect(header.charset).toBe("utf-8");
  });

  it("handles whitespace in initial value", () => {
    let header = new ContentType(" text/html ;  charset = iso-8859-1 ");
    expect(header.mediaType).toBe("text/html");
    expect(header.charset).toBe("iso-8859-1");
  });

  it("sets and gets media type", () => {
    let header = new ContentType("text/plain");
    header.mediaType = "application/json";
    expect(header.mediaType).toBe("application/json");
  });

  it("sets and gets charset", () => {
    let header = new ContentType("text/plain");
    header.charset = "utf-8";
    expect(header.charset).toBe("utf-8");
  });

  it("sets and gets boundary", () => {
    let header = new ContentType("multipart/form-data");
    header.boundary = "abc123";
    expect(header.boundary).toBe("abc123");
  });

  it("handles quoted attribute values", () => {
    let header = new ContentType('text/plain; charset="us-ascii"');
    expect(header.charset).toBe("us-ascii");
  });

  it("converts to string correctly", () => {
    let header = new ContentType("text/plain; charset=utf-8");
    expect(header.toString()).toBe("text/plain; charset=utf-8");
  });

  it("converts to an empty string when media type is not set", () => {
    let header = new ContentType();
    header.charset = "utf-8";
    expect(header.toString()).toBe("");
  });

  it("handles multiple attributes", () => {
    let header = new ContentType(
      'multipart/form-data; boundary="abc123"; charset=utf-8'
    );
    expect(header.mediaType).toBe("multipart/form-data");
    expect(header.boundary).toBe("abc123");
    expect(header.charset).toBe("utf-8");
  });

  it("preserves case for media type", () => {
    let header = new ContentType("Text/HTML");
    expect(header.mediaType).toBe("Text/HTML");
  });

  it("handles attribute values with special characters", () => {
    let header = new ContentType(
      'multipart/form-data; boundary="---=_Part_0_1234567.89"'
    );
    expect(header.boundary).toBe("---=_Part_0_1234567.89");
  });

  it("correctly quotes attribute values in toString()", () => {
    let header = new ContentType("multipart/form-data");
    header.boundary = "abc 123";
    expect(header.toString()).toBe('multipart/form-data; boundary="abc 123"');
  });

  it("handles empty attribute values", () => {
    let header = new ContentType("text/plain; charset=");
    expect(header.charset).toBe("");
  });

  it("ignores attributes without values", () => {
    let header = new ContentType("text/plain; charset");
    expect(header.charset).toBeUndefined();
  });

  it("preserves order of attributes in toString()", () => {
    let header = new ContentType(
      "multipart/form-data; charset=utf-8; boundary=abc123"
    );
    expect(header.toString()).toBe(
      "multipart/form-data; charset=utf-8; boundary=abc123"
    );
  });
});
