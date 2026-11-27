import { readFileSync } from "fs";
import { runInNewContext } from "vm";

// name-symbols.js is a classic content script (no ES exports), so it's
// evaluated against a stub window instead of being imported.
const context = { window: {} };
runInNewContext(
  readFileSync(new URL("../src/utils/name-symbols.js", import.meta.url), "utf8"),
  context,
);
const { stripEmoji } = context.window.leadGenerator;

describe("stripEmoji", () => {
  test.each([
    ["trailing emoji", "Anna Schimmel 🔥", "Anna Schimmel"],
    ["emoji with variation selector", "Jan Wilbrink ☀️", "Jan Wilbrink"],
    ["flag", "Piet Jansen 🇳🇱", "Piet Jansen"],
    ["skin tone and ZWJ sequence", "Eva 👩🏽‍💻 de Vries", "Eva de Vries"],
    ["subdivision flag", "Ian Jones 🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Ian Jones"],
    ["keycap", "Tom Smith 1️⃣", "Tom Smith 1"],
    ["leading emoji", "🚀 Marta Kowalska", "Marta Kowalska"],
    ["emoji glued to a word", "Schimmel🔥", "Schimmel"],
  ])("%s", (_, input, expected) => {
    expect(stripEmoji(input)).toBe(expected);
  });

  test.each([
    ["Latin with diacritics", "Łukasz Dąbrowski-Žák"],
    ["apostrophe and dot", "Sean O'Neil Jr."],
    ["Cyrillic", "Олена Шевченко"],
    ["CJK", "山田 太郎"],
    ["Arabic", "محمد علي"],
    ["Devanagari with combining marks", "अनिल कुमार"],
  ])("keeps %s untouched", (_, name) => {
    expect(stripEmoji(name)).toBe(name);
  });

  test("collapses whitespace left behind", () => {
    expect(stripEmoji("  Anna  🔥  Schimmel  ")).toBe("Anna Schimmel");
  });
});
