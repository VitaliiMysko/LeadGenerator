import { syncGet } from "../utils/chrome-storage.js";

export async function transliterateElement(inputElement) {
  const transliterationEnabled = !!(await syncGet(
    "transliterationEnabled",
  ));

  const value = inputElement.value.trim();

  const baseTransliterated = transliterate(value);
  const attributeValue = hasGermanLetters(value)
    ? transliterate(transliterateGermanLetters(value))
    : baseTransliterated;
  inputElement.value = transliterationEnabled ? baseTransliterated : value;
  inputElement.setAttribute(`data-${inputElement.id}`, attributeValue);
}

export function hasGermanLetters(text) {
  return /[äöüÄÖÜ]/.test(text);
}

export function transliterateGermanLetters(text) {
  const map = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
  };

  return text.replace(/[äöüÄÖÜ]/g, (match) => map[match]);
}
