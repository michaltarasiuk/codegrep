import { describe, expect, it } from "vitest";

import { Cookie } from "./cookie.js";

describe("Cookie", () => {
  it("initializes with an empty string", () => {
    let header = new Cookie("");
    expect(header.size).toBe(0);
  });

  it("initializes with a string", () => {
    let header = new Cookie("name1=value1; name2=value2");
    expect(header.get("name1")).toBe("value1");
    expect(header.get("name2")).toBe("value2");
  });

  it("initializes with an array", () => {
    let header = new Cookie([
      ["name1", "value1"],
      ["name2", "value2"],
    ]);
    expect(header.get("name1")).toBe("value1");
    expect(header.get("name2")).toBe("value2");
  });

  it("initializes with an object", () => {
    let header = new Cookie({ name1: "value1", name2: "value2" });
    expect(header.get("name1")).toBe("value1");
    expect(header.get("name2")).toBe("value2");
  });

  it("initializes with another Cookie", () => {
    let header = new Cookie(new Cookie("name1=value1; name2=value2"));
    expect(header.get("name1")).toBe("value1");
    expect(header.get("name2")).toBe("value2");
  });

  it("handles whitespace in initial value", () => {
    let header = new Cookie(" name1 = value1 ;  name2  =  value2 ");
    expect(header.get("name1")).toBe("value1");
    expect(header.get("name2")).toBe("value2");
  });

  it("gets all names", () => {
    let header = new Cookie("name1=value1; name2=value2");
    expect(header.names).toEqual(["name1", "name2"]);
  });

  it("gets all values", () => {
    let header = new Cookie("name1=value1; name2=value2");
    expect(header.values).toEqual(["value1", "value2"]);
  });

  it("sets and gets values", () => {
    let header = new Cookie();
    header.set("name", "value");
    expect(header.get("name")).toBe("value");
  });

  it("returns `null` for nonexistent values", () => {
    let header = new Cookie();
    expect(header.get("name")).toBeNull();
  });

  it("deletes values", () => {
    let header = new Cookie("name=value");
    expect(header.has("name")).toBe(true);
    header.delete("name");
    expect(header.has("name")).toBe(false);
  });

  it("checks if value exists", () => {
    let header = new Cookie("name=value");
    expect(header.has("name")).toBe(true);
    expect(header.has("nonexistent")).toBe(false);
  });

  it("clears all values", () => {
    let header = new Cookie("name1=value1; name2=value2");
    expect(header.size).toBe(2);
    header.clear();
    expect(header.size).toBe(0);
  });

  it("iterates over entries", () => {
    let header = new Cookie("name1=value1; name2=value2");
    let entries = Array.from(header.entries());
    expect(entries).toEqual([
      ["name1", "value1"],
      ["name2", "value2"],
    ]);
  });

  it("uses forEach correctly", () => {
    let header = new Cookie("name1=value1; name2=value2");
    let result: [string, string][] = [];
    header.forEach((name, value) => {
      result.push([name, value]);
    });
    expect(result).toEqual([
      ["name1", "value1"],
      ["name2", "value2"],
    ]);
  });

  it("returns correct size", () => {
    let header = new Cookie("name1=value1; name2=value2");
    expect(header.size).toBe(2);
  });

  it("converts to string correctly", () => {
    let header = new Cookie("name1=value1; name2=value2");
    expect(header.toString()).toBe("name1=value1; name2=value2");
  });

  it("is directly iterable", () => {
    let header = new Cookie("name1=value1; name2=value2");
    let entries = Array.from(header);
    expect(entries).toEqual([
      ["name1", "value1"],
      ["name2", "value2"],
    ]);
  });

  it("handles cookies without values", () => {
    let header = new Cookie("name1=value1; name2");
    expect(header.get("name1")).toBe("value1");
    expect(header.get("name2")).toBe("");
  });

  it("handles setting empty values", () => {
    let header = new Cookie("");
    header.set("name", "");
    expect(header.get("name")).toBe("");
    expect(header.toString()).toBe("name=");
  });

  it("overwrites existing values", () => {
    let header = new Cookie("name=value1");
    header.set("name", "value2");
    expect(header.get("name")).toBe("value2");
  });
});
