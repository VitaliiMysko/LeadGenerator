import { isValidDomain, getHostName } from "../src/scripts/services/company-data.js";

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
  test("strips query string and path from a pasted url", () => {
    expect(getHostName("https://www.example.com/about?ref=123")).toBe("example.com");
  });
  test("strips www from a bare domain typed with a leading www.", () => {
    expect(getHostName("www.example.com/pricing")).toBe("example.com");
  });
});

describe("isValidDomain(getHostName(...)) — pasted URL to domain view", () => {
  test("a full pasted url converts to a valid bare domain", () => {
    expect(isValidDomain(getHostName("https://www.example.com/about?ref=123"))).toBe(true);
  });
  test("gibberish with no TLD still fails after conversion", () => {
    expect(isValidDomain(getHostName("not a url"))).toBe(false);
  });
});
