import { buildLeadRecord, formatLeadsAsTsv, formatLeadsAsJson } from "../src/utils/lead-export.js";

const KEY_MAP = {
  "first-name": "firstName",
  "second-name": "surname",
  "email": "email",
};

const FIELD_ORDER = ["first-name", "second-name", "email"];

const makeLead = (overrides = {}) => ({
  firstName: "John",
  surname: "Smith",
  email: "john@example.com",
  companyId: "acme-123",
  hasOpenJobs: "true",
  ...overrides,
});

describe("buildLeadRecord", () => {
  test("maps fields in the given order using the key map", () => {
    expect(buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, false)).toEqual({
      firstName: "John",
      surname: "Smith",
      email: "john@example.com",
    });
  });

  test("defaults missing values to an empty string", () => {
    const lead = makeLead({ email: undefined });
    expect(buildLeadRecord(lead, FIELD_ORDER, KEY_MAP, false).email).toBe("");
  });

  test("appends companyId last when includeCompanyId is true", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, true);
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "companyId"]);
    expect(record.companyId).toBe("acme-123");
  });

  test("appends hasOpenJobs after companyId when both are enabled", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, true, true);
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "companyId", "hasOpenJobs"]);
    expect(record.hasOpenJobs).toBe("true");
  });

  test("appends hasOpenJobs last when only includeOpenJobs is true", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, false, true);
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "hasOpenJobs"]);
  });

  test("defaults hasOpenJobs to an empty string for leads saved without it", () => {
    const lead = makeLead({ hasOpenJobs: undefined });
    expect(buildLeadRecord(lead, FIELD_ORDER, KEY_MAP, false, true).hasOpenJobs).toBe("");
  });

  test("omits hasOpenJobs by default", () => {
    expect(buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, true)).not.toHaveProperty("hasOpenJobs");
  });

  test("omits companyId when includeCompanyId is false", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, false);
    expect(record).not.toHaveProperty("companyId");
  });
});

describe("formatLeadsAsTsv", () => {
  test("starts with a header line, then joins fields with tabs and leads with newlines", () => {
    const leads = [makeLead(), makeLead({ firstName: "Jane", surname: "Doe" })];
    expect(formatLeadsAsTsv(leads, FIELD_ORDER, KEY_MAP, false)).toBe(
      "Name\tSurname\tEmail\nJohn\tSmith\tjohn@example.com\nJane\tDoe\tjohn@example.com",
    );
  });

  test("header follows the given field order", () => {
    const order = ["email", "second-name", "first-name"];
    const [header] = formatLeadsAsTsv([makeLead()], order, KEY_MAP, false).split("\n");
    expect(header).toBe("Email\tSurname\tName");
  });

  test("names every panel field in the header", () => {
    const keyMap = {
      "first-name": "firstName",
      "second-name": "surname",
      "job-position": "jobPosition",
      "link": "link",
      "email": "email",
      "company-name": "companyName",
      "company-country": "country",
      "company-industry": "industry",
    };
    const [header] = formatLeadsAsTsv([makeLead()], Object.keys(keyMap), keyMap, true, true).split("\n");
    expect(header).toBe(
      "Name\tSurname\tJob position\tLink\tEmail\tCompany name\tCountry\tIndustry\tCompany id\tHas open jobs",
    );
  });

  test("falls back to the key for a column without a name", () => {
    const keyMap = { ...KEY_MAP, extra: "extraField" };
    const [header] = formatLeadsAsTsv([makeLead()], ["extra"], keyMap, false).split("\n");
    expect(header).toBe("extraField");
  });

  test("appends companyId column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, true)).toBe(
      "Name\tSurname\tEmail\tCompany id\nJohn\tSmith\tjohn@example.com\tacme-123",
    );
  });

  test("appends the hasOpenJobs column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, true, true)).toBe(
      "Name\tSurname\tEmail\tCompany id\tHas open jobs\nJohn\tSmith\tjohn@example.com\tacme-123\ttrue",
    );
  });

  test("returns an empty string for no leads", () => {
    expect(formatLeadsAsTsv([], FIELD_ORDER, KEY_MAP, false)).toBe("");
  });
});

describe("formatLeadsAsJson", () => {
  test("produces a JSON array of ordered records", () => {
    const result = formatLeadsAsJson([makeLead()], FIELD_ORDER, KEY_MAP, false);
    expect(JSON.parse(result)).toEqual([
      { firstName: "John", surname: "Smith", email: "john@example.com" },
    ]);
  });

  test("includes companyId when enabled", () => {
    const result = formatLeadsAsJson([makeLead()], FIELD_ORDER, KEY_MAP, true);
    expect(JSON.parse(result)[0].companyId).toBe("acme-123");
  });

  test("includes hasOpenJobs when enabled", () => {
    const result = formatLeadsAsJson([makeLead({ hasOpenJobs: "false" })], FIELD_ORDER, KEY_MAP, false, true);
    expect(JSON.parse(result)[0].hasOpenJobs).toBe("false");
  });

  test("returns an empty array for no leads", () => {
    expect(JSON.parse(formatLeadsAsJson([], FIELD_ORDER, KEY_MAP, false))).toEqual([]);
  });
});
