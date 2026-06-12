import { prepareEmailName, collectEmails } from "../src/utils/email-utils.js";

describe("prepareEmailName", () => {
  test("standard two-part name", () => {
    expect(prepareEmailName("John Smith")).toBe("john.smith");
  });

  test("trims surrounding whitespace", () => {
    expect(prepareEmailName("  John Smith  ")).toBe("john.smith");
  });

  test("lowercases the result", () => {
    expect(prepareEmailName("JOHN SMITH")).toBe("john.smith");
  });

  test("removes special characters like apostrophe", () => {
    expect(prepareEmailName("O'Brien")).toBe("obrien");
  });

  test("preserves hyphen within a name part", () => {
    expect(prepareEmailName("Anna-Marie Weber")).toBe("anna-marie.weber");
  });

  test("handles three-part name", () => {
    expect(prepareEmailName("Jan van Berg")).toBe("jan.van.berg");
  });

  test("single word name", () => {
    expect(prepareEmailName("Smith")).toBe("smith");
  });

  test("removes trailing hyphen", () => {
    expect(prepareEmailName("Smith-")).toBe("smith");
  });

  test("removes leading hyphen", () => {
    expect(prepareEmailName("-Smith")).toBe("smith");
  });

  test("handles name with numbers", () => {
    expect(prepareEmailName("John2 Smith")).toBe("john2.smith");
  });

  test("collapses multiple spaces to a single dot", () => {
    expect(prepareEmailName("John  Smith")).toBe("john.smith");
  });

  test("three-part name with single-char middle segment", () => {
    expect(prepareEmailName("A B C")).toBe("a.b.c");
  });

  test("empty string returns empty string", () => {
    expect(prepareEmailName("")).toBe("");
  });

  test("whitespace-only input returns empty string", () => {
    expect(prepareEmailName("   ")).toBe("");
  });
});

describe("collectEmails", () => {
  test("single-part name produces one email", () => {
    const emails = [];
    collectEmails(emails, "example.com", "Smith");
    expect(emails).toEqual(["smith@example.com"]);
  });

  test("standard two-part name includes common variants", () => {
    const emails = [];
    collectEmails(emails, "example.com", "John Smith");
    expect(emails).toContain("john.smith@example.com");
    expect(emails).toContain("jsmith@example.com");
    expect(emails).toContain("j.smith@example.com");
    expect(emails).toContain("john@example.com");
    expect(emails).toContain("smith@example.com");
  });

  test("produces no duplicate emails", () => {
    const emails = [];
    collectEmails(emails, "example.com", "John Smith");
    expect(emails.length).toBe(new Set(emails).size);
  });

  test("Dutch surname with 'van' generates correct variants", () => {
    const emails = [];
    collectEmails(emails, "example.com", "Jan van Berg");
    expect(emails).toContain("jan.van.berg@example.com");
    expect(emails).toContain("jberg@example.com");
    expect(emails).toContain("berg@example.com");
  });

  test("all generated emails use the provided host", () => {
    const emails = [];
    collectEmails(emails, "company.org", "John Smith");
    expect(emails.every((e) => e.endsWith("@company.org"))).toBe(true);
  });

  test("hyphenated first name generates firstNoHyphen variants", () => {
    const emails = [];
    collectEmails(emails, "example.com", "Anna-Marie Weber");
    expect(emails).toContain("anna-marie.weber@example.com");
  });
});
