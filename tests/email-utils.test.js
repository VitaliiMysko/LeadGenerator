import {
  prepareEmailName,
  collectEmails,
  buildEmailCacheKey,
} from "../src/utils/email-utils.js";

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

describe("buildEmailCacheKey", () => {
  test("same domain and name give the same key", () => {
    expect(buildEmailCacheKey("example.com", "John", "Smith")).toBe(
      buildEmailCacheKey("example.com", "John", "Smith"),
    );
  });

  test("ignores letter case and surrounding whitespace", () => {
    expect(buildEmailCacheKey(" Example.com ", " JOHN", "smith ")).toBe(
      buildEmailCacheKey("example.com", "John", "Smith"),
    );
  });

  test("a different first name gives a different key", () => {
    expect(buildEmailCacheKey("example.com", "Jane", "Smith")).not.toBe(
      buildEmailCacheKey("example.com", "John", "Smith"),
    );
  });

  test("a different surname gives a different key", () => {
    expect(buildEmailCacheKey("example.com", "John", "Doe")).not.toBe(
      buildEmailCacheKey("example.com", "John", "Smith"),
    );
  });

  test("a different domain gives a different key", () => {
    expect(buildEmailCacheKey("other.com", "John", "Smith")).not.toBe(
      buildEmailCacheKey("example.com", "John", "Smith"),
    );
  });

  test("name parts cannot run into each other", () => {
    expect(buildEmailCacheKey("example.com", "Ann", "aSmith")).not.toBe(
      buildEmailCacheKey("example.com", "Anna", "Smith"),
    );
  });

  test("keeps non-ASCII letters", () => {
    expect(buildEmailCacheKey("example.com", "Łukasz", "Nowak")).not.toBe(
      buildEmailCacheKey("example.com", "Lukasz", "Nowak"),
    );
  });

  test("treats missing values as empty", () => {
    expect(buildEmailCacheKey("", undefined, null)).toBe(
      buildEmailCacheKey("", "", ""),
    );
  });
});
