import {
  upsertCompanyCacheEntry,
  findCompanyCacheEntry,
  removeCompanyCacheEntry,
  updateCompanyCacheEntryWebsite,
} from "../src/utils/company-cache.js";

describe("upsertCompanyCacheEntry", () => {
  test("adds a new entry to the front of an empty list", () => {
    const result = upsertCompanyCacheEntry([], "111", "Acme", { website: "a.com" }, 10);
    expect(result).toEqual([
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ]);
  });

  test("adds a new entry in front of existing entries", () => {
    const existing = [{ companyId: "111", companyName: "Acme", data: { website: "a.com" } }];
    const result = upsertCompanyCacheEntry(existing, "222", "Globex", { website: "b.com" }, 10);
    expect(result).toEqual([
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ]);
  });

  test("replaces an existing entry for the same company id and moves it to the front", () => {
    const existing = [
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ];
    const result = upsertCompanyCacheEntry(existing, "111", "Acme", { website: "updated.com" }, 10);
    expect(result).toEqual([
      { companyId: "111", companyName: "Acme", data: { website: "updated.com" } },
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
    ]);
  });

  test("evicts the oldest entry once maxSize is exceeded", () => {
    const existing = [
      { companyId: "2", companyName: "B", data: {} },
      { companyId: "1", companyName: "A", data: {} },
    ];
    const result = upsertCompanyCacheEntry(existing, "3", "C", {}, 2);
    expect(result.map((entry) => entry.companyId)).toEqual(["3", "2"]);
  });

  test("returns the list unchanged when companyId is empty", () => {
    const existing = [{ companyId: "111", companyName: "Acme", data: {} }];
    const result = upsertCompanyCacheEntry(existing, "", "Acme", {}, 10);
    expect(result).toBe(existing);
  });
});

describe("findCompanyCacheEntry", () => {
  const entries = [
    { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
  ];

  test("returns the data for a matching company id", () => {
    expect(findCompanyCacheEntry(entries, "222", "")).toEqual({ website: "b.com" });
  });

  test("returns undefined when the company id is not cached", () => {
    expect(findCompanyCacheEntry(entries, "999", "")).toBeUndefined();
  });

  test("falls back to matching by company name when companyId is empty", () => {
    expect(findCompanyCacheEntry(entries, "", "Globex")).toEqual({ website: "b.com" });
  });

  test("company name matching is case-insensitive and trims whitespace", () => {
    expect(findCompanyCacheEntry(entries, "", "  globex  ")).toEqual({ website: "b.com" });
  });

  test("prefers companyId over companyName when both are provided", () => {
    expect(findCompanyCacheEntry(entries, "111", "Globex")).toEqual({ website: "a.com" });
  });

  test("returns undefined when neither companyId nor companyName is provided", () => {
    expect(findCompanyCacheEntry(entries, "", "")).toBeUndefined();
  });

  test("returns undefined when the company name is not cached", () => {
    expect(findCompanyCacheEntry(entries, "", "Unknown Inc")).toBeUndefined();
  });
});

describe("removeCompanyCacheEntry", () => {
  const entries = [
    { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
  ];

  test("removes the entry matching the given company id", () => {
    expect(removeCompanyCacheEntry(entries, "111")).toEqual([
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
    ]);
  });

  test("returns the list unchanged when the company id is not found", () => {
    expect(removeCompanyCacheEntry(entries, "999")).toEqual(entries);
  });

  test("returns the list unchanged when companyId is empty", () => {
    expect(removeCompanyCacheEntry(entries, "")).toBe(entries);
  });
});

describe("updateCompanyCacheEntryWebsite", () => {
  const entries = [
    { companyId: "111", companyName: "Acme", data: { website: "a.com", location: "US" } },
    { companyId: "222", companyName: "Globex", data: { website: "b.com", location: "UK" } },
  ];

  test("updates the website for the entry matching the company id, preserving other data fields", () => {
    const result = updateCompanyCacheEntryWebsite(entries, "111", "", "updated.com");
    expect(result).toEqual([
      { companyId: "111", companyName: "Acme", data: { website: "updated.com", location: "US" } },
      { companyId: "222", companyName: "Globex", data: { website: "b.com", location: "UK" } },
    ]);
  });

  test("falls back to matching by company name when companyId is empty", () => {
    const result = updateCompanyCacheEntryWebsite(entries, "", "Globex", "updated.com");
    expect(result[1].data.website).toBe("updated.com");
  });

  test("returns the list unchanged when no entry matches", () => {
    const result = updateCompanyCacheEntryWebsite(entries, "999", "", "updated.com");
    expect(result).toBe(entries);
  });

  test("returns the list unchanged when neither companyId nor companyName is provided", () => {
    const result = updateCompanyCacheEntryWebsite(entries, "", "", "updated.com");
    expect(result).toBe(entries);
  });
});
