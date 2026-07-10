import { extractCompanyId } from "../src/utils/company-id.js";

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
