import { trimAsciiWhitespace } from "./text-utils.js";

export function filterOptions(options, query = "") {
  const needle = query.toLowerCase();
  return options.filter((opt) => opt.toLowerCase().includes(needle));
}

// Returns the option matching `value` case-insensitively (ignoring surrounding
// whitespace), or "" for an empty value, or null when nothing matches.
export function resolveOption(options, value) {
  const needle = trimAsciiWhitespace(value || "").toLowerCase();
  if (!needle) return "";
  return options.find((opt) => opt.toLowerCase() === needle) ?? null;
}
