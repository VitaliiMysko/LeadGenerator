import { isDuplicate } from "../src/utils/lead-utils.js";

const makeLead = (overrides = {}) => ({
  firstName: "John",
  surname: "Smith",
  jobPosition: "Engineer",
  link: "https://linkedin.com/in/john",
  email: "",
  companyName: "Acme",
  country: "Germany",
  industry: "Tech",
  ...overrides,
});

describe("isDuplicate", () => {
  test("returns false for empty leads array", () => {
    expect(isDuplicate([], makeLead())).toBe(false);
  });

  test("detects duplicate by email (exact match)", () => {
    const leads = [makeLead({ email: "test@example.com" })];
    expect(isDuplicate(leads, makeLead({ email: "test@example.com" }))).toBe(true);
  });

  test("email match is case-insensitive", () => {
    const leads = [makeLead({ email: "TEST@EXAMPLE.COM" })];
    expect(isDuplicate(leads, makeLead({ email: "test@example.com" }))).toBe(true);
  });

  test("returns false when emails differ", () => {
    const leads = [makeLead({ email: "other@example.com" })];
    expect(isDuplicate(leads, makeLead({ email: "test@example.com" }))).toBe(false);
  });

  test("detects duplicate by all fields when both have no email", () => {
    expect(isDuplicate([makeLead()], makeLead())).toBe(true);
  });

  test("returns false when one field differs and no email", () => {
    const leads = [makeLead({ jobPosition: "Manager" })];
    expect(isDuplicate(leads, makeLead({ jobPosition: "Engineer" }))).toBe(false);
  });

  test("no-email new lead does not match existing lead with email", () => {
    const leads = [makeLead({ email: "test@example.com" })];
    expect(isDuplicate(leads, makeLead({ email: "" }))).toBe(false);
  });

  test("checks all leads, not just first", () => {
    const leads = [
      makeLead({ email: "first@example.com" }),
      makeLead({ email: "second@example.com" }),
    ];
    expect(isDuplicate(leads, makeLead({ email: "second@example.com" }))).toBe(true);
  });
});
