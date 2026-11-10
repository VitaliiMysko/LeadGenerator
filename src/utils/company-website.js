import { trimAsciiWhitespace } from "./text-utils.js";

// A company's website as saved with a lead: the domain shown in its card
// ("acme.com"), or "" when there is none, it is still loading, or it isn't
// a valid domain (e.g. "No website found").
export function normalizeCompanyWebsite(website) {
  if (typeof website !== "string") return "";
  const domain = trimAsciiWhitespace(website);
  return /^[\w.-]+\.[a-zA-Z]{2,}$/.test(domain) ? domain : "";
}
