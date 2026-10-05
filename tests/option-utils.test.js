import { filterOptions, resolveOption } from "../src/utils/option-utils.js";

const OPTIONS = ["Poland", "Portugal", "United Kingdom", "Türkiye"];

describe("filterOptions", () => {
  test("returns all options for an empty query", () => {
    expect(filterOptions(OPTIONS, "")).toEqual(OPTIONS);
  });
  test("returns all options when the query is omitted", () => {
    expect(filterOptions(OPTIONS)).toEqual(OPTIONS);
  });
  test("matches a substring case-insensitively", () => {
    expect(filterOptions(OPTIONS, "po")).toEqual(["Poland", "Portugal"]);
  });
  test("matches inside the option name", () => {
    expect(filterOptions(OPTIONS, "kingdom")).toEqual(["United Kingdom"]);
  });
  test("returns an empty list when nothing matches", () => {
    expect(filterOptions(OPTIONS, "xyz")).toEqual([]);
  });
});

describe("resolveOption", () => {
  test("returns the canonical option for an exact match", () => {
    expect(resolveOption(OPTIONS, "Poland")).toBe("Poland");
  });
  test("matches case-insensitively and returns the canonical spelling", () => {
    expect(resolveOption(OPTIONS, "united kingdom")).toBe("United Kingdom");
  });
  test("ignores surrounding whitespace", () => {
    expect(resolveOption(OPTIONS, "  Türkiye \t")).toBe("Türkiye");
  });
  test("returns an empty string for an empty value", () => {
    expect(resolveOption(OPTIONS, "")).toBe("");
  });
  test("returns an empty string for a whitespace-only value", () => {
    expect(resolveOption(OPTIONS, "   ")).toBe("");
  });
  test("returns an empty string for null", () => {
    expect(resolveOption(OPTIONS, null)).toBe("");
  });
  test("returns null for a partial match", () => {
    expect(resolveOption(OPTIONS, "Pol")).toBeNull();
  });
  test("returns null for an unknown value", () => {
    expect(resolveOption(OPTIONS, "Atlantis")).toBeNull();
  });
});
