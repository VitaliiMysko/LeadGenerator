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
  companySize: "51-200",
  companyMembers: "75045",
  hasOpenJobs: "true",
  ...overrides,
});

describe("buildLeadRecord", () => {
  test("maps fields in the given order using the key map", () => {
    expect(buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP)).toEqual({
      firstName: "John",
      surname: "Smith",
      email: "john@example.com",
    });
  });

  test("defaults missing values to an empty string", () => {
    const lead = makeLead({ email: undefined });
    expect(buildLeadRecord(lead, FIELD_ORDER, KEY_MAP).email).toBe("");
  });

  test("appends companyId last when includeCompanyId is true", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, { includeCompanyId: true });
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "companyId"]);
    expect(record.companyId).toBe("acme-123");
  });

  test("appends hasOpenJobs after companyId when both are enabled", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, { includeCompanyId: true, includeOpenJobs: true });
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "companyId", "hasOpenJobs"]);
    expect(record.hasOpenJobs).toBe("true");
  });

  test("appends hasOpenJobs last when only includeOpenJobs is true", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, { includeOpenJobs: true });
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "hasOpenJobs"]);
  });

  test("defaults hasOpenJobs to an empty string for leads saved without it", () => {
    const lead = makeLead({ hasOpenJobs: undefined });
    expect(buildLeadRecord(lead, FIELD_ORDER, KEY_MAP, { includeOpenJobs: true }).hasOpenJobs).toBe("");
  });

  test("omits hasOpenJobs by default", () => {
    expect(buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, { includeCompanyId: true })).not.toHaveProperty("hasOpenJobs");
  });

  test("appends companySize between companyId and hasOpenJobs", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, {
      includeCompanyId: true,
      includeCompanySize: true,
      includeOpenJobs: true,
    });
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "companyId", "companySize", "hasOpenJobs"]);
    expect(record.companySize).toBe("51-200");
  });

  test("omits companySize by default and defaults it to an empty string for leads saved without it", () => {
    expect(buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP)).not.toHaveProperty("companySize");
    const lead = makeLead({ companySize: undefined });
    expect(buildLeadRecord(lead, FIELD_ORDER, KEY_MAP, { includeCompanySize: true }).companySize).toBe("");
  });

  test("appends companyMembers between companySize and hasOpenJobs", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, {
      includeCompanySize: true,
      includeCompanyMembers: true,
      includeOpenJobs: true,
    });
    expect(Object.keys(record)).toEqual(["firstName", "surname", "email", "companySize", "companyMembers", "hasOpenJobs"]);
    expect(record.companyMembers).toBe("75045");
  });

  test("omits companyMembers by default and defaults it to an empty string for leads saved without it", () => {
    expect(buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP)).not.toHaveProperty("companyMembers");
    const lead = makeLead({ companyMembers: undefined });
    expect(buildLeadRecord(lead, FIELD_ORDER, KEY_MAP, { includeCompanyMembers: true }).companyMembers).toBe("");
  });

  test("omits companyId when includeCompanyId is false", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP);
    expect(record).not.toHaveProperty("companyId");
  });
});

describe("formatLeadsAsTsv", () => {
  test("starts with a header line, then joins fields with tabs and leads with newlines", () => {
    const leads = [makeLead(), makeLead({ firstName: "Jane", surname: "Doe" })];
    expect(formatLeadsAsTsv(leads, FIELD_ORDER, KEY_MAP)).toBe(
      "Name\tSurname\tEmail\nJohn\tSmith\tjohn@example.com\nJane\tDoe\tjohn@example.com",
    );
  });

  test("header follows the given field order", () => {
    const order = ["email", "second-name", "first-name"];
    const [header] = formatLeadsAsTsv([makeLead()], order, KEY_MAP).split("\n");
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
    const options = { includeCompanyId: true, includeCompanySize: true, includeCompanyMembers: true, includeOpenJobs: true };
    const [header] = formatLeadsAsTsv([makeLead()], Object.keys(keyMap), keyMap, options).split("\n");
    expect(header).toBe(
      "Name\tSurname\tJob position\tLink\tEmail\tCompany name\tCountry\tIndustry\tCompany id\tCompany size\tCompany members\tHas open jobs",
    );
  });

  test("falls back to the key for a column without a name", () => {
    const keyMap = { ...KEY_MAP, extra: "extraField" };
    const [header] = formatLeadsAsTsv([makeLead()], ["extra"], keyMap).split("\n");
    expect(header).toBe("extraField");
  });

  test("appends companyId column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanyId: true })).toBe(
      "Name\tSurname\tEmail\tCompany id\nJohn\tSmith\tjohn@example.com\tacme-123",
    );
  });

  test("appends the hasOpenJobs column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanyId: true, includeOpenJobs: true })).toBe(
      "Name\tSurname\tEmail\tCompany id\tHas open jobs\nJohn\tSmith\tjohn@example.com\tacme-123\ttrue",
    );
  });

  test("appends the companySize column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanySize: true })).toBe(
      "Name\tSurname\tEmail\tCompany size\nJohn\tSmith\tjohn@example.com\t51-200",
    );
  });

  test("appends the companyMembers column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanyMembers: true })).toBe(
      "Name\tSurname\tEmail\tCompany members\nJohn\tSmith\tjohn@example.com\t75045",
    );
  });

  test("omits the header line when includeHeader is false", () => {
    const leads = [makeLead(), makeLead({ firstName: "Jane", surname: "Doe" })];
    expect(formatLeadsAsTsv(leads, FIELD_ORDER, KEY_MAP, { includeCompanyId: true, includeHeader: false })).toBe(
      "John\tSmith\tjohn@example.com\tacme-123\nJane\tDoe\tjohn@example.com\tacme-123",
    );
  });

  test("returns an empty string for no leads", () => {
    expect(formatLeadsAsTsv([], FIELD_ORDER, KEY_MAP)).toBe("");
    expect(formatLeadsAsTsv([], FIELD_ORDER, KEY_MAP, { includeHeader: false })).toBe("");
  });
});

describe("formatLeadsAsJson", () => {
  test("produces a JSON array of ordered records", () => {
    const result = formatLeadsAsJson([makeLead()], FIELD_ORDER, KEY_MAP);
    expect(JSON.parse(result)).toEqual([
      { firstName: "John", surname: "Smith", email: "john@example.com" },
    ]);
  });

  test("includes companyId when enabled", () => {
    const result = formatLeadsAsJson([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanyId: true });
    expect(JSON.parse(result)[0].companyId).toBe("acme-123");
  });

  test("includes hasOpenJobs when enabled", () => {
    const result = formatLeadsAsJson([makeLead({ hasOpenJobs: "false" })], FIELD_ORDER, KEY_MAP, { includeOpenJobs: true });
    expect(JSON.parse(result)[0].hasOpenJobs).toBe("false");
  });

  test("includes companySize when enabled", () => {
    const result = formatLeadsAsJson([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanySize: true });
    expect(JSON.parse(result)[0].companySize).toBe("51-200");
  });

  test("includes companyMembers when enabled", () => {
    const result = formatLeadsAsJson([makeLead()], FIELD_ORDER, KEY_MAP, { includeCompanyMembers: true });
    expect(JSON.parse(result)[0].companyMembers).toBe("75045");
  });

  test("returns an empty array for no leads", () => {
    expect(JSON.parse(formatLeadsAsJson([], FIELD_ORDER, KEY_MAP))).toEqual([]);
  });
});
