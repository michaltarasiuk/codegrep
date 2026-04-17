import { describe, expect, it } from "vitest";

import { Accept } from "./accept.js";

describe("Accept", () => {
  it("initializes with an empty string", () => {
    let header = new Accept("");
    expect(header.size).toBe(0);
  });

  it("initializes with a string", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    expect(header.size).toBe(2);
  });

  it("initializes with an array", () => {
    let header = new Accept(["text/html", ["application/json", 0.9]]);
    expect(header.size).toBe(2);
  });

  it("initializes with an object", () => {
    let header = new Accept({ "text/html": 1, "application/json": 0.9 });
    expect(header.size).toBe(2);
  });

  it("initializes with another Accept", () => {
    let header = new Accept(new Accept("text/html,application/json;q=0.9"));
    expect(header.size).toBe(2);
  });

  it("handles whitespace in initial value", () => {
    let header = new Accept(" text/html ,  application/json;q=  0.9  ");
    expect(header.size).toBe(2);
  });

  it("gets all media types", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    expect(header.mediaTypes).toEqual(["text/html", "application/json"]);
  });

  it("gets all weights", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    expect(header.weights).toEqual([1, 0.9]);
  });

  it("checks if a media type is acceptable", () => {
    let header = new Accept("text/html,text/*;q=0.9,application/json;q=0.8");
    expect(header.accepts("text/html")).toBe(true);
    expect(header.accepts("text/*")).toBe(true);
    expect(header.accepts("text/plain")).toBe(true);
    expect(header.accepts("application/json")).toBe(true);
    expect(header.accepts("image/jpeg")).toBe(false);
  });

  it("gets the correct weight values", () => {
    let header = new Accept("text/html,text/*;q=0.9,application/json;q=0.8");
    expect(header.getWeight("text/html")).toBe(1);
    expect(header.getWeight("*/*")).toBe(1);
    expect(header.getWeight("text/*")).toBe(1);
    expect(header.getWeight("text/plain")).toBe(0.9);
    expect(header.getWeight("application/json")).toBe(0.8);
    expect(header.getWeight("image/jpeg")).toBe(0);
  });

  it("gets the preferred media type", () => {
    let header = new Accept("text/html,text/*;q=0.9,application/json;q=0.8");
    expect(header.getPreferred(["text/html", "application/json"])).toBe(
      "text/html"
    );
    expect(header.getPreferred(["text/plain", "text/html"])).toBe("text/html");
    expect(header.getPreferred(["image/jpeg"])).toBeNull();
  });

  it("sets and gets media types", () => {
    let header = new Accept();
    header.set("application/json", 0.9);
    expect(header.get("application/json")).toBe(0.9);
  });

  it("deletes media types", () => {
    let header = new Accept("text/html");
    expect(header.has("text/html")).toBe(true);
    header.delete("text/html");
    expect(header.has("text/html")).toBe(false);
  });

  it("clears all media types", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    header.clear();
    expect(header.size).toBe(0);
  });

  it("iterates over entries", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    let entries = Array.from(header.entries());
    expect(entries).toEqual([
      ["text/html", 1],
      ["application/json", 0.9],
    ]);
  });

  it("is directly iterable", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    let mediaTypes = Array.from(header);
    expect(mediaTypes).toEqual([
      ["text/html", 1],
      ["application/json", 0.9],
    ]);
  });

  it("uses forEach correctly", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    let result: [string, number][] = [];
    header.forEach((mediaType, weight) => {
      result.push([mediaType, weight]);
    });
    expect(result).toEqual([
      ["text/html", 1],
      ["application/json", 0.9],
    ]);
  });

  it("returns correct size", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    expect(header.size).toBe(2);
  });

  it("converts to string correctly", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    expect(header.toString()).toBe("text/html,application/json;q=0.9");
  });

  it("handles setting empty weight values", () => {
    let header = new Accept();
    header.set("text/html");
    expect(header.get("text/html")).toBe(1);
  });

  it("overwrites existing weight values", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    header.set("application/json", 0.8);
    expect(header.get("application/json")).toBe(0.8);
  });

  it("handles setting wildcard media types", () => {
    let header = new Accept();
    header.set("*/*");
    expect(header.get("*/*")).toBe(1);
  });

  it("sorts initial value", () => {
    let header = new Accept("application/json;q=0.9,text/html");
    expect(header.toString()).toBe("text/html,application/json;q=0.9");
    expect(header.mediaTypes).toEqual(["text/html", "application/json"]);
  });

  it("sorts updated value", () => {
    let header = new Accept("text/html,application/json;q=0.9");
    header.set("application/json", 0.8);
    expect(header.toString()).toBe("text/html,application/json;q=0.8");
    expect(header.mediaTypes).toEqual(["text/html", "application/json"]);
  });
});
