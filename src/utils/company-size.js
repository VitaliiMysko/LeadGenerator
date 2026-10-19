// LinkedIn writes company size in the user's interface language:
// "5,001-10,000 employees", "5.001–10.000 Beschäftigte", "5 001 – 10 000
// працівників", "5.001 a 10.000 funcionários", "従業員5,001～10,000人",
// "Több mint 10 001 alkalmazott", "۱۰٬۰۰۱+ کارمند". Only the numbers are read,
// so no language's wording is needed. The value may also run straight into the
// "N associated members" line, whose number must not be taken as a range end.
//
// Deliberately avoids String.prototype.trim() and regex-based .replace(): this
// runs in the panel, where the transliteration bundle patches both (see
// CLAUDE.md).

// Zero digit of each script LinkedIn may use: Latin, Arabic-Indic, Persian,
// Devanagari, Bengali, Gurmukhi, Telugu, Thai.
const DIGIT_ZEROS = [0x30, 0x660, 0x6f0, 0x966, 0x9e6, 0xa66, 0xc66, 0xe50];

// Bidirectional marks wrapped around numbers in Arabic, Hebrew and Persian.
const INVISIBLE_MARKS = new Set([
  "‎", "‏", "؜", "‪", "‫", "‬", "‭",
  "‮", "⁦", "⁧", "⁨", "⁩",
]);

// A number with optional thousands groups ("5,001", "5.001", "5 001",
// "10٬001"), or a plain run of digits.
const NUMBER_REGEX = /\d{1,3}(?:[,.   ٬']\d{3}(?!\d))+|\d+/g;

// Longest non-space text accepted between two numbers of a range: a dash,
// "~", "～", "a" (Portuguese), "à" (French).
const MAX_RANGE_SEPARATOR_LENGTH = 3;

// LinkedIn's size buckets are fixed and only the largest one is open-ended,
// so a lone number from it means "or more" even when written as words
// ("More than 10,001").
const OPEN_ENDED_SIZE = 10001;

export function formatCompanySize(size) {
  if (typeof size !== "string" || size === "") return "unknown";
  if (/myself only/i.test(size)) return "0-1";

  const text = normalizeText(size);
  const numbers = [...text.matchAll(NUMBER_REGEX)].map((match) => ({
    value: Number(digitsOnly(match[0])),
    start: match.index,
    end: match.index + match[0].length,
  }));
  if (numbers.length === 0) return "unknown";

  const [first, second] = numbers;
  if (second && isRangeSeparator(text.slice(first.end, second.start))) {
    return `${first.value}-${second.value}`;
  }

  const followedByPlus = /^\s*\+/.test(text.slice(first.end));
  if (followedByPlus || first.value >= OPEN_ENDED_SIZE) {
    return `${first.value}+`;
  }
  return "unknown";
}

function normalizeText(text) {
  let normalized = "";
  for (const char of text) {
    if (INVISIBLE_MARKS.has(char)) continue;
    normalized += toAsciiDigit(char);
  }
  return normalized;
}

function toAsciiDigit(char) {
  const codePoint = char.codePointAt(0);
  const zero = DIGIT_ZEROS.find(
    (start) => codePoint >= start && codePoint <= start + 9,
  );
  return zero === undefined ? char : String(codePoint - zero);
}

function digitsOnly(text) {
  return (text.match(/\d/g) || []).join("");
}

function isRangeSeparator(gap) {
  const visible = gap.match(/\S/g) || [];
  return visible.length > 0 && visible.length <= MAX_RANGE_SEPARATOR_LENGTH;
}
