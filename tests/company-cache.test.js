import {
  upsertCompanyCacheEntry,
  findCompanyCacheEntry,
  removeCompanyCacheEntry,
} from "../src/utils/company-cache.js";

describe("upsertCompanyCacheEntry", () => {
  test("adds a new entry to the front of an empty list", () => {
    const result = upsertCompanyCacheEntry([], "111", { website: "a.com" }, 10);
    expect(result).toEqual([{ companyId: "111", data: { website: "a.com" } }]);
  });

  test("adds a new entry in front of existing entries", () => {
    const existing = [{ companyId: "111", data: { website: "a.com" } }];
    const result = upsertCompanyCacheEntry(existing, "222", { website: "b.com" }, 10);
    expect(result).toEqual([
      { companyId: "222", data: { website: "b.com" } },
      { companyId: "111", data: { website: "a.com" } },
    ]);
  });

  test("replaces an existing entry for the same company id and moves it to the front", () => {
    const existing = [
      { companyId: "222", data: { website: "b.com" } },
      { companyId: "111", data: { website: "a.com" } },
    ];
    const result = upsertCompanyCacheEntry(existing, "111", { website: "updated.com" }, 10);
    expect(result).toEqual([
      { companyId: "111", data: { website: "updated.com" } },
      { companyId: "222", data: { website: "b.com" } },
    ]);
  });

  test("evicts the oldest entry once maxSize is exceeded", () => {
    const existing = [
      { companyId: "2", data: {} },
      { companyId: "1", data: {} },
    ];
    const result = upsertCompanyCacheEntry(existing, "3", {}, 2);
    expect(result.map((entry) => entry.companyId)).toEqual(["3", "2"]);
  });

  test("returns the list unchanged when companyId is empty", () => {
    const existing = [{ companyId: "111", data: {} }];
    const result = upsertCompanyCacheEntry(existing, "", {}, 10);
    expect(result).toBe(existing);
  });
});

describe("findCompanyCacheEntry", () => {
  const entries = [
    { companyId: "111", data: { website: "a.com" } },
    { companyId: "222", data: { website: "b.com" } },
  ];

  test("returns the data for a matching company id", () => {
    expect(findCompanyCacheEntry(entries, "222")).toEqual({ website: "b.com" });
  });

  test("returns undefined when the company id is not cached", () => {
    expect(findCompanyCacheEntry(entries, "999")).toBeUndefined();
  });

  test("returns undefined when companyId is empty", () => {
    expect(findCompanyCacheEntry(entries, "")).toBeUndefined();
  });
});

describe("removeCompanyCacheEntry", () => {
  const entries = [
    { companyId: "111", data: { website: "a.com" } },
    { companyId: "222", data: { website: "b.com" } },
  ];

  test("removes the entry matching the given company id", () => {
    expect(removeCompanyCacheEntry(entries, "111")).toEqual([
      { companyId: "222", data: { website: "b.com" } },
    ]);
  });

  test("returns the list unchanged when the company id is not found", () => {
    expect(removeCompanyCacheEntry(entries, "999")).toEqual(entries);
  });

  test("returns the list unchanged when companyId is empty", () => {
    expect(removeCompanyCacheEntry(entries, "")).toBe(entries);
  });
});
