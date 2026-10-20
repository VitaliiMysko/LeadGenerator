window.leadGenerator = window.leadGenerator || {};

(() => {
  // An experience date line reads "<start> – <end> · <duration>" in every
  // LinkedIn language: "Oct 2022 - Present · 4 yrs", "2014 – Jun 2015",
  // "Jan. 2024 – Heute", "2024年1月 - 現在 · 2年10ヶ月", "Jan 2024 - تاکنون".
  // The start always holds a year; the end holds one only for a past
  // position — a current one ends with a localized "Present" word instead —
  // so no language's wording is needed.
  const PERIOD_REGEX = /^(.{0,15}?\p{Nd}{4}.{0,6}?)\s*[-–—]\s*(.{1,40})$/u;
  const YEAR_REGEX = /\p{Nd}{4}/u;

  // Returns { isCurrent } for a date line, or null for any other text.
  function parseExperiencePeriod(text) {
    const period = text.split("·")[0].trim();
    const match = period.match(PERIOD_REGEX);
    if (!match) return null;
    return { isCurrent: !YEAR_REGEX.test(match[2]) };
  }

  window.leadGenerator.parseExperiencePeriod = parseExperiencePeriod;
})();
