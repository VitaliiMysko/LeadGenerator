import { getLinkedInPageType } from "../src/utils/linkedin-page.js";

describe("getLinkedInPageType", () => {
  test("recognizes a Sales Navigator lead page", () => {
    expect(
      getLinkedInPageType("https://www.linkedin.com/sales/lead/ACwAAA..."),
    ).toBe("salesNavigatorLead");
  });

  test("recognizes a public LinkedIn profile page", () => {
    expect(
      getLinkedInPageType("https://www.linkedin.com/in/anders-sandeberg-392463b/"),
    ).toBe("linkedinProfile");
  });

  test("recognizes a public LinkedIn profile page with a query string", () => {
    expect(
      getLinkedInPageType("https://www.linkedin.com/in/anders-sandeberg-392463b/?originalSubdomain=se"),
    ).toBe("linkedinProfile");
  });

  test("recognizes a public LinkedIn profile page without a trailing slash", () => {
    expect(
      getLinkedInPageType("https://www.linkedin.com/in/anders-sandeberg-392463b"),
    ).toBe("linkedinProfile");
  });

  test("returns null for a LinkedIn company page", () => {
    expect(getLinkedInPageType("https://www.linkedin.com/company/5010955/")).toBeNull();
  });

  test("returns null for an unrelated site", () => {
    expect(getLinkedInPageType("https://example.com/in/someone")).toBeNull();
  });

  test("returns null for undefined", () => {
    expect(getLinkedInPageType(undefined)).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(getLinkedInPageType("")).toBeNull();
  });
});
