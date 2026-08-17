import { jest } from "@jest/globals";

const mockLocalGet = jest.fn();
const mockLocalSet = jest.fn();

jest.unstable_mockModule("../src/scripts/utils/chrome-storage.js", () => ({
  localGet: mockLocalGet,
  localSet: mockLocalSet,
}));

const {
  getCachedCompany,
  setCachedCompany,
  removeCachedCompany,
  updateCachedCompanyWebsite,
} = await import("../src/scripts/store/company-cache-store.js");

beforeEach(() => {
  mockLocalGet.mockReset();
  mockLocalSet.mockReset();
  mockLocalGet.mockResolvedValue([]);
  mockLocalSet.mockResolvedValue(undefined);
});

describe("getCachedCompany", () => {
  test("returns undefined without touching storage when both companyId and companyName are empty", async () => {
    const result = await getCachedCompany("", "");
    expect(result).toBeUndefined();
    expect(mockLocalGet).not.toHaveBeenCalled();
  });

  test("returns undefined when the company id is not cached", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ]);
    const result = await getCachedCompany("999", "");
    expect(result).toBeUndefined();
  });

  test("returns the cached data for a matching company id", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ]);
    const result = await getCachedCompany("111", "");
    expect(result).toEqual({ website: "a.com" });
    expect(mockLocalGet).toHaveBeenCalledWith("cachedCompanies", []);
  });

  test("falls back to matching by company name when companyId is empty", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ]);
    const result = await getCachedCompany("", "Acme");
    expect(result).toEqual({ website: "a.com" });
  });
});

describe("setCachedCompany", () => {
  test("does nothing when companyId is empty", async () => {
    await setCachedCompany("", "Acme", { website: "a.com" });
    expect(mockLocalGet).not.toHaveBeenCalled();
    expect(mockLocalSet).not.toHaveBeenCalled();
  });

  test("persists a new entry at the front of the list", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
    ]);
    await setCachedCompany("111", "Acme", { website: "a.com" });
    expect(mockLocalSet).toHaveBeenCalledWith("cachedCompanies", [
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
    ]);
  });

  test("caps the persisted list at MAX_CACHED_COMPANIES (10)", async () => {
    const existing = Array.from({ length: 10 }, (_, i) => ({
      companyId: String(i),
      companyName: `Company ${i}`,
      data: {},
    }));
    mockLocalGet.mockResolvedValue(existing);
    await setCachedCompany("new", "New Co", {});
    const [, saved] = mockLocalSet.mock.calls[0];
    expect(saved).toHaveLength(10);
    expect(saved[0].companyId).toBe("new");
    expect(saved.map((entry) => entry.companyId)).not.toContain("9");
  });
});

describe("removeCachedCompany", () => {
  test("does nothing when companyId is empty", async () => {
    await removeCachedCompany("");
    expect(mockLocalGet).not.toHaveBeenCalled();
    expect(mockLocalSet).not.toHaveBeenCalled();
  });

  test("removes the matching entry from storage", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
    ]);
    await removeCachedCompany("111");
    expect(mockLocalSet).toHaveBeenCalledWith("cachedCompanies", [
      { companyId: "222", companyName: "Globex", data: { website: "b.com" } },
    ]);
  });
});

describe("updateCachedCompanyWebsite", () => {
  test("does nothing when both companyId and companyName are empty", async () => {
    await updateCachedCompanyWebsite("", "", "updated.com");
    expect(mockLocalGet).not.toHaveBeenCalled();
    expect(mockLocalSet).not.toHaveBeenCalled();
  });

  test("updates the website for the entry matching the company id", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "111", companyName: "Acme", data: { website: "a.com", location: "US" } },
    ]);
    await updateCachedCompanyWebsite("111", "Acme", "updated.com");
    expect(mockLocalSet).toHaveBeenCalledWith("cachedCompanies", [
      { companyId: "111", companyName: "Acme", data: { website: "updated.com", location: "US" } },
    ]);
  });

  test("falls back to matching by company name when companyId is empty", async () => {
    mockLocalGet.mockResolvedValue([
      { companyId: "111", companyName: "Acme", data: { website: "a.com" } },
    ]);
    await updateCachedCompanyWebsite("", "Acme", "updated.com");
    expect(mockLocalSet).toHaveBeenCalledWith("cachedCompanies", [
      { companyId: "111", companyName: "Acme", data: { website: "updated.com" } },
    ]);
  });
});
