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

  test("omits companyId when includeCompanyId is false", () => {
    const record = buildLeadRecord(makeLead(), FIELD_ORDER, KEY_MAP, false);
    expect(record).not.toHaveProperty("companyId");
  });
});

describe("formatLeadsAsTsv", () => {
  test("joins fields with tabs and leads with newlines", () => {
    const leads = [makeLead(), makeLead({ firstName: "Jane", surname: "Doe" })];
    expect(formatLeadsAsTsv(leads, FIELD_ORDER, KEY_MAP, false)).toBe(
      "John\tSmith\tjohn@example.com\nJane\tDoe\tjohn@example.com",
    );
  });

  test("appends companyId column when enabled", () => {
    expect(formatLeadsAsTsv([makeLead()], FIELD_ORDER, KEY_MAP, true)).toBe(
      "John\tSmith\tjohn@example.com\tacme-123",
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

  test("returns an empty array for no leads", () => {
    expect(JSON.parse(formatLeadsAsJson([], FIELD_ORDER, KEY_MAP, false))).toEqual([]);
  });
});
