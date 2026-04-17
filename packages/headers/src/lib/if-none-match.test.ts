import { describe, expect, it } from "vitest";

import { IfNoneMatch } from "./if-none-match.js";

describe("IfNoneMatch", () => {
  it("initializes with an empty string", () => {
    let header = new IfNoneMatch("");
    expect(header.tags).toEqual([]);
  });

  it("initializes with a string with a single tag", () => {
    let header = new IfNoneMatch("67ab43");
    expect(header.tags).toEqual(['"67ab43"']);

    let header2 = new IfNoneMatch('"67ab43"');
    expect(header2.tags).toEqual(['"67ab43"']);

    let header3 = new IfNoneMatch('W/"67ab43"');
    expect(header3.tags).toEqual(['W/"67ab43"']);
  });

  it("initializes with a string with multiple tags", () => {
    let header = new IfNoneMatch("67ab43, 54ed21");
    expect(header.tags).toEqual(['"67ab43"', '"54ed21"']);

    let header2 = new IfNoneMatch('"67ab43", "54ed21"');
    expect(header2.tags).toEqual(['"67ab43"', '"54ed21"']);

    let header3 = new IfNoneMatch('W/"67ab43", "54ed21"');
    expect(header3.tags).toEqual(['W/"67ab43"', '"54ed21"']);
  });

  it("initializes with an array of tags", () => {
    let header = new IfNoneMatch(["67ab43", "54ed21"]);
    expect(header.tags).toEqual(['"67ab43"', '"54ed21"']);

    let header2 = new IfNoneMatch(['"67ab43"', '"54ed21"']);
    expect(header2.tags).toEqual(['"67ab43"', '"54ed21"']);

    let header3 = new IfNoneMatch(['W/"67ab43"', '"54ed21"']);
    expect(header3.tags).toEqual(['W/"67ab43"', '"54ed21"']);
  });

  it("initializes with an object", () => {
    let header = new IfNoneMatch({ tags: ["67ab43", "54ed21"] });
    expect(header.tags).toEqual(['"67ab43"', '"54ed21"']);

    let header2 = new IfNoneMatch({ tags: ['"67ab43"', '"54ed21"'] });
    expect(header2.tags).toEqual(['"67ab43"', '"54ed21"']);

    let header3 = new IfNoneMatch({ tags: ['W/"67ab43"', '"54ed21"'] });
    expect(header3.tags).toEqual(['W/"67ab43"', '"54ed21"']);
  });

  it("initializes with another IfNoneMatch", () => {
    let header = new IfNoneMatch(new IfNoneMatch("67ab43, 54ed21"));
    expect(header.tags).toEqual(['"67ab43"', '"54ed21"']);
  });

  it("checks if a tag is present", () => {
    let header = new IfNoneMatch("67ab43, 54ed21");
    expect(header.has('"67ab43"')).toBe(true);
    expect(header.has('"54ed21"')).toBe(true);
    expect(header.has('"7892dd"')).toBe(false);
    expect(header.has("*")).toBe(false);

    let header2 = new IfNoneMatch('W/"67ab43", "54ed21"');
    expect(header2.has('W/"67ab43"')).toBe(true);
    expect(header2.has('"54ed21"')).toBe(true);
    expect(header2.has('"7892dd"')).toBe(false);
  });

  it("checks if a tag matches", () => {
    let header = new IfNoneMatch("67ab43, 54ed21");
    expect(header.matches('"67ab43"')).toBe(true);
    expect(header.matches('"54ed21"')).toBe(true);
    expect(header.matches('"7892dd"')).toBe(false);

    let header2 = new IfNoneMatch('W/"67ab43", "54ed21"');
    expect(header2.matches('W/"67ab43"')).toBe(true);
    expect(header2.matches('"54ed21"')).toBe(true);
    expect(header2.matches('"7892dd"')).toBe(false);

    let header3 = new IfNoneMatch("*");
    expect(header3.matches('"67ab43"')).toBe(true);
    expect(header3.matches('"54ed21"')).toBe(true);
  });

  it("converts to a string", () => {
    let header = new IfNoneMatch('W/"67ab43", "54ed21"');
    expect(header.toString()).toBe('W/"67ab43", "54ed21"');
  });
});
