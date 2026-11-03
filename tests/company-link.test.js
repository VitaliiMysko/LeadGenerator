import { fillMissingCompanyLinks } from "../src/utils/company-link.js";

const ACME_LINK = "https://www.linkedin.com/sales/company/111";

describe("fillMissingCompanyLinks", () => {
  test("borrows the link of another position at the same company", () => {
    const result = fillMissingCompanyLinks([
      { companyName: "Acme", companyLink: "", jobPosition: "CTO" },
      { companyName: "Acme", companyLink: ACME_LINK, jobPosition: "CEO" },
    ]);
    expect(result[0]).toEqual({ companyName: "Acme", companyLink: ACME_LINK, jobPosition: "CTO" });
    expect(result[1].companyLink).toBe(ACME_LINK);
  });

  test("matches the name ignoring case and surrounding spaces", () => {
    const result = fillMissingCompanyLinks([
      { companyName: " acme ", companyLink: undefined },
      { companyName: "Acme", companyLink: ACME_LINK },
    ]);
    expect(result[0].companyLink).toBe(ACME_LINK);
  });

  test("keeps the position without a link when no other position has the same name", () => {
    const result = fillMissingCompanyLinks([
      { companyName: "Acme", companyLink: "" },
      { companyName: "Globex", companyLink: ACME_LINK },
    ]);
    expect(result[0].companyLink).toBe("");
  });

  test("keeps the position without a link when same-named positions link to different companies", () => {
    const result = fillMissingCompanyLinks([
      { companyName: "Acme", companyLink: "" },
      { companyName: "Acme", companyLink: ACME_LINK },
      { companyName: "Acme", companyLink: "https://www.linkedin.com/sales/company/222" },
    ]);
    expect(result[0].companyLink).toBe("");
  });

  test("uses a link shared by several positions", () => {
    const result = fillMissingCompanyLinks([
      { companyName: "Acme", companyLink: ACME_LINK },
      { companyName: "Acme", companyLink: "" },
      { companyName: "Acme", companyLink: ACME_LINK },
    ]);
    expect(result[1].companyLink).toBe(ACME_LINK);
  });

  test("never changes a position that already has a link", () => {
    const own = "https://www.linkedin.com/sales/company/222";
    const result = fillMissingCompanyLinks([
      { companyName: "Acme", companyLink: own },
      { companyName: "Acme", companyLink: ACME_LINK },
    ]);
    expect(result.map((company) => company.companyLink)).toEqual([own, ACME_LINK]);
  });

  test("ignores positions without a company name", () => {
    const result = fillMissingCompanyLinks([
      { companyName: "", companyLink: "" },
      { companyName: "", companyLink: ACME_LINK },
    ]);
    expect(result[0].companyLink).toBe("");
  });
});
