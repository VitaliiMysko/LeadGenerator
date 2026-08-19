import { trimAsciiWhitespace } from "../src/utils/text-utils.js";

describe("trimAsciiWhitespace", () => {
  test("removes leading and trailing ASCII spaces", () => {
    expect(trimAsciiWhitespace("  Kampuš  ")).toBe("Kampuš");
  });

  test("removes leading and trailing tabs and newlines", () => {
    expect(trimAsciiWhitespace("\t\nKampuš\r\n")).toBe("Kampuš");
  });

  test("does not touch Latin Extended-A letters, including at the end of the string", () => {
    expect(trimAsciiWhitespace("Kampuš")).toBe("Kampuš");
    expect(trimAsciiWhitespace("Kampušš")).toBe("Kampušš");
    expect(trimAsciiWhitespace("Ștefan")).toBe("Ștefan");
  });

  test("returns the string unchanged when there is no surrounding whitespace", () => {
    expect(trimAsciiWhitespace("Miha")).toBe("Miha");
  });

  test("returns an empty string for whitespace-only input", () => {
    expect(trimAsciiWhitespace("   ")).toBe("");
  });

  test("returns an empty string for empty input", () => {
    expect(trimAsciiWhitespace("")).toBe("");
  });

  test("does not trim internal whitespace", () => {
    expect(trimAsciiWhitespace("  Miha Kampuš  ")).toBe("Miha Kampuš");
  });
});
