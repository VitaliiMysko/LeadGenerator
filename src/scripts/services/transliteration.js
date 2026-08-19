import { syncGet } from "../utils/chrome-storage.js";
import { trimAsciiWhitespace } from "../../utils/text-utils.js";

export async function transliterateElement(inputElement) {
  const transliterationEnabled = !!(await syncGet(
    "transliterationEnabled",
  ));

  // Not String.prototype.trim(): the transliteration library bundle (loaded as
  // a classic <script>, so it patches globals for this whole page) ships an old
  // core-js polyfill for trim that mishandles some Latin Extended-A letters at
  // the end of a string as trimmable whitespace, silently dropping them (e.g.
  // "š"). The value from lead.js is already trimmed at the source; this only
  // guards against plain ASCII spaces a user might type via the "change"
  // listener below.
  const value = trimAsciiWhitespace(inputElement.value);

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
