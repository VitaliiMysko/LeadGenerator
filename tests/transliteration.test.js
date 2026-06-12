import { hasGermanLetters, transliterateGermanLetters } from "../src/scripts/services/transliteration.js";

describe("hasGermanLetters", () => {
  test("detects ä", () => expect(hasGermanLetters("Schäfer")).toBe(true));
  test("detects ö", () => expect(hasGermanLetters("Köhler")).toBe(true));
  test("detects ü", () => expect(hasGermanLetters("Müller")).toBe(true));
  test("detects uppercase Ä", () => expect(hasGermanLetters("Ärger")).toBe(true));
  test("detects uppercase Ö", () => expect(hasGermanLetters("Öl")).toBe(true));
  test("detects uppercase Ü", () => expect(hasGermanLetters("Über")).toBe(true));
  test("returns false for plain ASCII text", () => expect(hasGermanLetters("Smith")).toBe(false));
  test("returns false for empty string", () => expect(hasGermanLetters("")).toBe(false));
  test("returns false for other accented chars", () => expect(hasGermanLetters("Résumé")).toBe(false));
});

describe("transliterateGermanLetters", () => {
  test("ä → ae", () => expect(transliterateGermanLetters("ä")).toBe("ae"));
  test("ö → oe", () => expect(transliterateGermanLetters("ö")).toBe("oe"));
  test("ü → ue", () => expect(transliterateGermanLetters("ü")).toBe("ue"));
  test("Ä → Ae", () => expect(transliterateGermanLetters("Ä")).toBe("Ae"));
  test("Ö → Oe", () => expect(transliterateGermanLetters("Ö")).toBe("Oe"));
  test("Ü → Ue", () => expect(transliterateGermanLetters("Ü")).toBe("Ue"));
  test("full name Müller → Mueller", () => expect(transliterateGermanLetters("Müller")).toBe("Mueller"));
  test("full name Schäfer → Schaefer", () => expect(transliterateGermanLetters("Schäfer")).toBe("Schaefer"));
  test("leaves non-German text unchanged", () => expect(transliterateGermanLetters("normal")).toBe("normal"));
  test("handles mixed German and ASCII", () => expect(transliterateGermanLetters("Müller-Smith")).toBe("Mueller-Smith"));
});
