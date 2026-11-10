import { normalizeCompanyMembers } from "../src/utils/company-members.js";

describe("normalizeCompanyMembers", () => {
  test.each([
    ["75045", "75045"],
    ["0", "0"],
    ["007", "7"],
  ])("keeps the number %s as %s", (members, expected) => {
    expect(normalizeCompanyMembers(members)).toBe(expected);
  });

  test.each(["", "unknown", "75,045", "Loading", null, undefined, 75045])(
    "returns an empty string for %p",
    (members) => {
      expect(normalizeCompanyMembers(members)).toBe("");
    },
  );
});
