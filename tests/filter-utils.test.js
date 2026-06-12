import { matchesFilter } from "../src/utils/filter-utils.js";

describe("matchesFilter", () => {
  test("empty filters always returns true", () => {
    expect(matchesFilter("Berlin", [])).toBe(true);
  });

  test("empty filters with empty value returns true", () => {
    expect(matchesFilter("", [])).toBe(true);
  });

  test("exact match returns true", () => {
    expect(matchesFilter("Berlin", ["Berlin"])).toBe(true);
  });

  test("match is case-insensitive (value lower, filter upper)", () => {
    expect(matchesFilter("berlin", ["BERLIN"])).toBe(true);
  });

  test("match is case-insensitive (value upper, filter lower)", () => {
    expect(matchesFilter("BERLIN", ["berlin"])).toBe(true);
  });

  test("substring match returns true", () => {
    expect(matchesFilter("Berlin, Germany", ["Germany"])).toBe(true);
  });

  test("non-matching filter returns false", () => {
    expect(matchesFilter("Berlin", ["Munich"])).toBe(false);
  });

  test("empty value with non-empty filters returns false", () => {
    expect(matchesFilter("", ["Berlin"])).toBe(false);
  });

  test("returns true if any filter in the list matches", () => {
    expect(matchesFilter("Berlin", ["Munich", "Berlin", "Hamburg"])).toBe(true);
  });

  test("returns false if no filter in the list matches", () => {
    expect(matchesFilter("Berlin", ["Munich", "Hamburg"])).toBe(false);
  });

  test("partial filter substring match", () => {
    expect(matchesFilter("11-50 employees", ["11-50"])).toBe(true);
  });
});
