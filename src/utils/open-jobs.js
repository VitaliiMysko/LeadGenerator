import { trimAsciiWhitespace } from "./text-utils.js";

// A company's open job titles are an array once checked (empty when it has
// no open jobs) and absent until then.
export function isOpenJobsKnown(openJobTitles) {
  return Array.isArray(openJobTitles);
}

// Whether any open job title contains one of the keywords, ignoring case.
// With no keywords, any open job counts.
export function hasMatchingOpenJob(openJobTitles, keywords) {
  if (keywords.length === 0) return openJobTitles.length > 0;

  const titles = openJobTitles.map((title) => title.toLowerCase());
  return keywords.some((keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return titles.some((title) => title.includes(lowerKeyword));
  });
}

// Value saved with a lead: "true" / "false", or "" when not checked.
export function getOpenJobsValue(openJobTitles, keywords) {
  return isOpenJobsKnown(openJobTitles)
    ? String(hasMatchingOpenJob(openJobTitles, keywords))
    : "";
}

export function serializeOpenJobTitles(openJobTitles) {
  return isOpenJobsKnown(openJobTitles) ? JSON.stringify(openJobTitles) : "";
}

export function parseOpenJobTitles(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return isOpenJobsKnown(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Adds the comma-separated keywords typed by the user, skipping blanks and
// ones already present (ignoring case).
export function addKeywords(keywords, input) {
  const result = [...keywords];
  input.split(",").forEach((part) => {
    const keyword = trimAsciiWhitespace(part);
    const lowerKeyword = keyword.toLowerCase();
    if (keyword && !result.some((existing) => existing.toLowerCase() === lowerKeyword)) {
      result.push(keyword);
    }
  });
  return result;
}
