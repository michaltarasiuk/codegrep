import { describe, expect, it } from "vitest";

import { AcceptLanguage } from "./accept-language.js";

describe("Accept-Language", () => {
  it("initializes with an empty string", () => {
    let header = new AcceptLanguage("");
    expect(header.size).toBe(0);
  });

  it("initializes with a string", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.size).toBe(2);
  });

  it("initializes with an array", () => {
    let header = new AcceptLanguage(["en-US", ["en", 0.9]]);
    expect(header.size).toBe(2);
  });

  it("initializes with an object", () => {
    let header = new AcceptLanguage({ "en-US": 1, en: 0.9 });
    expect(header.size).toBe(2);
  });

  it("initializes with another AcceptLanguage", () => {
    let header = new AcceptLanguage(new AcceptLanguage("en-US,en;q=0.9"));
    expect(header.size).toBe(2);
  });

  it("handles whitespace in initial value", () => {
    let header = new AcceptLanguage(" en-US ,  en;q=  0.9  ");
    expect(header.size).toBe(2);
  });

  it("gets all languages", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.languages).toEqual(["en-us", "en"]);
  });

  it("gets all weights", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.weights).toEqual([1, 0.9]);
  });

  it("checks if a language is acceptable", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9,fr;q=0.8");
    expect(header.accepts("en-US")).toBe(true);
    expect(header.accepts("en")).toBe(true);
    expect(header.accepts("en-GB")).toBe(true);
    expect(header.accepts("fr")).toBe(true);
    expect(header.accepts("fi")).toBe(false);
  });

  it("gets the correct weight values", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9,fr;q=0.8");
    expect(header.getWeight("en-US")).toBe(1);
    expect(header.getWeight("*")).toBe(1);
    expect(header.getWeight("en")).toBe(1);
    expect(header.getWeight("en-GB")).toBe(0.9);
    expect(header.getWeight("fr")).toBe(0.8);
    expect(header.getWeight("fi")).toBe(0);
  });

  it("gets the preferred language", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.getPreferred(["en-GB", "en-US"])).toBe("en-US");
    expect(header.getPreferred(["en-GB", "en"])).toBe("en");
    expect(header.getPreferred(["fr", "en-GB"])).toBe("en-GB");
    expect(header.getPreferred(["fi", "ja"])).toBeNull();
  });

  it("sets and gets languages", () => {
    let header = new AcceptLanguage();
    header.set("en", 0.9);
    expect(header.get("en")).toBe(0.9);
  });

  it("deletes languages", () => {
    let header = new AcceptLanguage("en-US");
    expect(header.has("en-US")).toBe(true);
    header.delete("en-US");
    expect(header.has("en-US")).toBe(false);
  });

  it("clears all languages", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.size).toBe(2);
    header.clear();
    expect(header.size).toBe(0);
  });

  it("iterates over entries", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    let entries = Array.from(header.entries());
    expect(entries).toEqual([
      ["en-us", 1],
      ["en", 0.9],
    ]);
  });

  it("is directly iterable", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    let entries = Array.from(header);
    expect(entries).toEqual([
      ["en-us", 1],
      ["en", 0.9],
    ]);
  });

  it("uses forEach correctly", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    let result: [string, number][] = [];
    header.forEach((language, weight) => {
      result.push([language, weight]);
    });
    expect(result).toEqual([
      ["en-us", 1],
      ["en", 0.9],
    ]);
  });

  it("returns correct size", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.size).toBe(2);
  });

  it("converts to string", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    expect(header.toString()).toBe("en-us,en;q=0.9");
  });

  it("handles setting empty weight values", () => {
    let header = new AcceptLanguage();
    header.set("en-US");
    expect(header.get("en-US")).toBe(1);
  });

  it("overwrites existing weight values", () => {
    let header = new AcceptLanguage("en;q=0.9");
    header.set("en", 1);
    expect(header.get("en")).toBe(1);
  });

  it("handles setting wildcard value", () => {
    let header = new AcceptLanguage();
    header.set("*");
    expect(header.get("*")).toBe(1);
  });

  it("sorts initial value", () => {
    let header = new AcceptLanguage("en;q=0.9,en-US");
    expect(header.toString()).toBe("en-us,en;q=0.9");
  });

  it("sorts updated value", () => {
    let header = new AcceptLanguage("en-US,en;q=0.9");
    header.set("fi");
    expect(header.toString()).toBe("en-us,fi,en;q=0.9");
    header.set("en-US", 0.8);
    expect(header.toString()).toBe("fi,en;q=0.9,en-us;q=0.8");
  });
});
