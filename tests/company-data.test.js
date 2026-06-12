import { isValidDomain, getHostName, formatCompanySize } from "../src/scripts/services/company-data.js";

describe("isValidDomain", () => {
  test("simple valid domain", () => expect(isValidDomain("example.com")).toBe(true));
  test("valid subdomain", () => expect(isValidDomain("sub.example.com")).toBe(true));
  test("two-part TLD", () => expect(isValidDomain("example.co.uk")).toBe(true));
  test("domain with hyphen", () => expect(isValidDomain("my-company.com")).toBe(true));
  test("trims surrounding spaces", () => expect(isValidDomain("  example.com  ")).toBe(true));
  test("missing TLD fails", () => expect(isValidDomain("example")).toBe(false));
  test("single-char TLD fails", () => expect(isValidDomain("example.c")).toBe(false));
  test("empty string fails", () => expect(isValidDomain("")).toBe(false));
  test("null fails", () => expect(isValidDomain(null)).toBe(false));
  test("undefined fails", () => expect(isValidDomain(undefined)).toBe(false));
  test("space in domain fails", () => expect(isValidDomain("my domain.com")).toBe(false));
});

describe("getHostName", () => {
  test("strips www from http url", () => {
    expect(getHostName("http://www.example.com")).toBe("example.com");
  });
  test("strips www from https url with path", () => {
    expect(getHostName("https://www.example.com/about")).toBe("example.com");
  });
  test("handles url without protocol", () => {
    expect(getHostName("www.example.com")).toBe("example.com");
  });
  test("handles bare domain", () => {
    expect(getHostName("example.com")).toBe("example.com");
  });
  test("preserves non-www subdomain", () => {
    expect(getHostName("https://careers.example.com")).toBe("careers.example.com");
  });
  test("returns original input for truly invalid url", () => {
    expect(getHostName("not a url")).toBe("not a url");
  });
});

describe("formatCompanySize", () => {
  test("null returns unknown", () => expect(formatCompanySize(null)).toBe("unknown"));
  test("undefined returns unknown", () => expect(formatCompanySize(undefined)).toBe("unknown"));
  test("empty string returns unknown", () => expect(formatCompanySize("")).toBe("unknown"));
  test("unrecognized text returns unknown", () => expect(formatCompanySize("lots of people")).toBe("unknown"));

  test("'Myself only' returns 0-1", () => expect(formatCompanySize("Myself only")).toBe("0-1"));
  test("case-insensitive myself only", () => expect(formatCompanySize("MYSELF ONLY")).toBe("0-1"));

  test("simple numeric range", () => expect(formatCompanySize("2-10 employees")).toBe("2-10"));
  test("range with comma-formatted numbers", () => expect(formatCompanySize("1,001-5,000 employees")).toBe("1001-5000"));
  test("range with en dash", () => expect(formatCompanySize("201 – 500 employees")).toBe("201-500"));
  test("large range", () => expect(formatCompanySize("10,001-50,000")).toBe("10001-50000"));

  test("plus notation", () => expect(formatCompanySize("10,001+ employees")).toBe("10001+"));
  test("simple plus", () => expect(formatCompanySize("500+")).toBe("500+"));
});
