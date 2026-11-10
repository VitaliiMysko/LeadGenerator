import { normalizeCompanyWebsite } from "../src/utils/company-website.js";

describe("normalizeCompanyWebsite", () => {
  test.each([
    ["acme.com", "acme.com"],
    ["shop.acme.co.uk", "shop.acme.co.uk"],
    ["  acme.com \n", "acme.com"],
  ])("keeps the domain %p as %p", (website, expected) => {
    expect(normalizeCompanyWebsite(website)).toBe(expected);
  });

  test.each(["", "No website found", "Loading website", "acme", null, undefined, 42])(
    "returns an empty string for %p",
    (website) => {
      expect(normalizeCompanyWebsite(website)).toBe("");
    },
  );
});
