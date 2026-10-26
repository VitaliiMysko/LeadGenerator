import { extractCompanyId, getCompanyCacheKey } from "../src/utils/company-id.js";

describe("extractCompanyId", () => {
  test("extracts numeric id from a sales navigator company link", () => {
    expect(
      extractCompanyId("https://www.linkedin.com/sales/company/11223344"),
    ).toBe("11223344");
  });

  test("extracts numeric id when link has trailing path segments", () => {
    expect(
      extractCompanyId("https://www.linkedin.com/sales/company/11223344/overview"),
    ).toBe("11223344");
  });

  test("returns empty string for undefined link", () => {
    expect(extractCompanyId(undefined)).toBe("");
  });

  test("returns empty string for empty link", () => {
    expect(extractCompanyId("")).toBe("");
  });

  test("returns empty string when link has no company id", () => {
    expect(extractCompanyId("https://www.linkedin.com/sales/lead/12345")).toBe("");
  });
});

describe("getCompanyCacheKey", () => {
  test("uses the company id when the link has one", () => {
    expect(
      getCompanyCacheKey("https://www.linkedin.com/sales/company/11223344?_ntb=abc", "Acme"),
    ).toBe("11223344");
  });

  test("gives the same key for links differing only by query parameters", () => {
    expect(getCompanyCacheKey("https://www.linkedin.com/sales/company/11223344?_ntb=abc", "Acme")).toBe(
      getCompanyCacheKey("https://www.linkedin.com/sales/company/11223344?_ntb=xyz", "Acme"),
    );
  });

  test("falls back to the link when it has no company id", () => {
    expect(getCompanyCacheKey("https://www.linkedin.com/sales/lead/12345", "Acme")).toBe(
      "https://www.linkedin.com/sales/lead/12345",
    );
  });

  test("falls back to the company name without a link", () => {
    expect(getCompanyCacheKey("", "Acme")).toBe("Acme");
  });

  test("returns empty string without a link or name", () => {
    expect(getCompanyCacheKey("", "")).toBe("");
  });
});
