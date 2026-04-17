import { describe, expect, it } from "vitest";

import { AcceptEncoding } from "./accept-encoding.js";

describe("Accept-Encoding", () => {
  it("initializes with an empty string", () => {
    let header = new AcceptEncoding("");
    expect(header.size).toBe(0);
  });

  it("initializes with a string", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.size).toBe(2);
  });

  it("initializes with an array", () => {
    let header = new AcceptEncoding(["gzip", ["deflate", 0.9]]);
    expect(header.size).toBe(2);
  });

  it("initializes with an object", () => {
    let header = new AcceptEncoding({ gzip: 1, deflate: 0.9 });
    expect(header.size).toBe(2);
  });

  it("initializes with another AcceptEncoding", () => {
    let header = new AcceptEncoding(new AcceptEncoding("gzip, deflate;q=0.9"));
    expect(header.size).toBe(2);
  });

  it("handles whitespace in initial value", () => {
    let header = new AcceptEncoding(" gzip ,  deflate;q=  0.9  ");
    expect(header.size).toBe(2);
  });

  it("gets all encodings", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.encodings).toEqual(["gzip", "deflate"]);
  });

  it("gets all weights", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.weights).toEqual([1, 0.9]);
  });

  it("checks if an encoding is acceptable", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9,br;q=0.8");
    expect(header.accepts("gzip")).toBe(true);
    expect(header.accepts("deflate")).toBe(true);
    expect(header.accepts("br")).toBe(true);
    expect(header.accepts("compress")).toBe(false);
    expect(header.accepts("identity")).toBe(true); // special case
  });

  it("gets the correct weights", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9,*;q=0.8");
    expect(header.getWeight("gzip")).toBe(1);
    expect(header.getWeight("deflate")).toBe(0.9);
    expect(header.getWeight("br")).toBe(0.8);
  });

  it("gets the preferred encoding", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9,*;q=0.8");
    expect(header.getPreferred(["gzip", "deflate"])).toBe("gzip");
    expect(header.getPreferred(["deflate", "br"])).toBe("deflate");
  });

  it("sets and gets encodings", () => {
    let header = new AcceptEncoding();
    header.set("gzip", 1);
    expect(header.get("gzip")).toBe(1);
  });

  it("deletes encodings", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.has("gzip")).toBe(true);
    header.delete("gzip");
    expect(header.has("gzip")).toBe(false);
  });

  it("clears all encodings", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.size).toBe(2);
    header.clear();
    expect(header.size).toBe(0);
  });

  it("iterates over entries", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(Array.from(header.entries())).toEqual([
      ["gzip", 1],
      ["deflate", 0.9],
    ]);
  });

  it("is directly iterable", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(Array.from(header)).toEqual([
      ["gzip", 1],
      ["deflate", 0.9],
    ]);
  });

  it("uses forEach correctly", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    let result: [string, number][] = [];
    header.forEach((encoding, weight) => {
      result.push([encoding, weight]);
    });
    expect(result).toEqual([
      ["gzip", 1],
      ["deflate", 0.9],
    ]);
  });

  it("returns correct size", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.size).toBe(2);
  });

  it("converts to a string", () => {
    let header = new AcceptEncoding("gzip, deflate;q=0.9");
    expect(header.toString()).toBe("gzip,deflate;q=0.9");
  });

  it("handles setting empty weights", () => {
    let header = new AcceptEncoding();
    header.set("deflate");
    expect(header.get("deflate")).toBe(1);
  });

  it("handles setting wildcard value", () => {
    let header = new AcceptEncoding();
    header.set("*", 0.8);
    expect(header.get("*")).toBe(0.8);
  });

  it("sorts initial value", () => {
    let header = new AcceptEncoding("deflate;q=0.9,gzip");
    expect(header.toString()).toBe("gzip,deflate;q=0.9");
  });

  it("sorts updated value", () => {
    let header = new AcceptEncoding("gzip;q=0.8,deflate");
    header.set("br");
    expect(header.toString()).toBe("deflate,br,gzip;q=0.8");
    header.set("deflate", 0.9);
    expect(header.toString()).toBe("br,deflate;q=0.9,gzip;q=0.8");
  });
});
