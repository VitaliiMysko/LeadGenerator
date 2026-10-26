import { findSelectedCompanyIndex } from "../src/utils/selected-company.js";

const companies = [
  { companyId: "111", companyName: "Acme" },
  { companyId: "222", companyName: "Globex" },
  { companyId: "333", companyName: "Initech" },
  { companyId: "222", companyName: "Globex" },
];

describe("findSelectedCompanyIndex", () => {
  test("finds the company by id", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "333", companyName: "" })).toBe(2);
  });

  test("returns the first of several matching companies", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "222", companyName: "Globex" })).toBe(1);
  });

  test("prefers the id over the name", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "333", companyName: "Acme" })).toBe(2);
  });

  test("falls back to the name when the id doesn't match", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "999", companyName: "Initech" })).toBe(2);
  });

  test("matches the name ignoring case and surrounding spaces", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "", companyName: "  globex " })).toBe(1);
  });

  test("matches a non-ASCII name", () => {
    const list = [{ companyId: "", companyName: "Ąžuolas" }, { companyId: "", companyName: "Żabka" }];
    expect(findSelectedCompanyIndex(list, { companyId: "", companyName: "żabka" })).toBe(1);
  });

  test("matches a company without an id by name", () => {
    const list = [{ companyId: "", companyName: "Acme" }];
    expect(findSelectedCompanyIndex(list, { companyId: "111", companyName: "Acme" })).toBe(0);
  });

  test("returns -1 when nothing matches", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "999", companyName: "Umbrella" })).toBe(-1);
  });

  test("returns -1 without a target", () => {
    expect(findSelectedCompanyIndex(companies, null)).toBe(-1);
  });

  test("returns -1 for a target with neither id nor name", () => {
    expect(findSelectedCompanyIndex(companies, { companyId: "", companyName: "" })).toBe(-1);
  });
});
