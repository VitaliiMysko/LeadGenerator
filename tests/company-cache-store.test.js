import { jest } from "@jest/globals";

const mockLocalGet = jest.fn();
const mockLocalSet = jest.fn();

jest.unstable_mockModule("../src/scripts/utils/chrome-storage.js", () => ({
  localGet: mockLocalGet,
  localSet: mockLocalSet,
}));

const { getCachedCompany, setCachedCompany, removeCachedCompany } = await import(
  "../src/scripts/store/company-cache-store.js"
);

beforeEach(() => {
  mockLocalGet.mockReset();
  mockLocalSet.mockReset();
  mockLocalGet.mockResolvedValue([]);
  mockLocalSet.mockResolvedValue(undefined);
});

describe("getCachedCompany", () => {
  test("returns undefined without touching storage when companyId is empty", async () => {
    const result = await getCachedCompany("");
    expect(result).toBeUndefined();
    expect(mockLocalGet).not.toHaveBeenCalled();
  });

  test("returns undefined when the company id is not cached", async () => {
    mockLocalGet.mockResolvedValue([{ companyId: "111", data: { website: "a.com" } }]);
    const result = await getCachedCompany("999");
    expect(result).toBeUndefined();
  });

  test("returns the cached data for a matching company id", async () => {
    mockLocalGet.mockResolvedValue([{ companyId: "111", data: { website: "a.com" } }]);
    const result = await getCachedCompany("111");
    expect(result).toEqual({ website: "a.com" });
    expect(mockLocalGet).toHaveBeenCalledWith("cachedCompanies", []);
  });
});

describe("setCachedCompany", () => {
  test("does nothing when companyId is empty", async () => {
    await setCachedCompany("", { website: "a.com" });
    expect(mockLocalGet).not.toHaveBeenCalled();
    expect(mockLocalSet).not.toHaveBeenCalled();
  });

  test("persists a new entry at the front of the list", async () => {
    mockLocalGet.mockResolvedValue([{ companyId: "222", data: { website: "b.com" } }]);
    await setCachedCompany("111", { website: "a.com" });
    expect(mockLocalSet).toHaveBeenCalledWith("cachedCompanies", [
      { companyId: "111", data: { website: "a.com" } },
      { companyId: "222", data: { website: "b.com" } },
    ]);
  });

  test("caps the persisted list at MAX_CACHED_COMPANIES (10)", async () => {
    const existing = Array.from({ length: 10 }, (_, i) => ({
      companyId: String(i),
      data: {},
    }));
    mockLocalGet.mockResolvedValue(existing);
    await setCachedCompany("new", {});
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
      { companyId: "111", data: { website: "a.com" } },
      { companyId: "222", data: { website: "b.com" } },
    ]);
    await removeCachedCompany("111");
    expect(mockLocalSet).toHaveBeenCalledWith("cachedCompanies", [
      { companyId: "222", data: { website: "b.com" } },
    ]);
  });
});
