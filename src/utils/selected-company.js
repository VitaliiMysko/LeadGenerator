import { trimAsciiWhitespace } from "./text-utils.js";

function normalizeName(name) {
  return trimAsciiWhitespace(name || "").toLowerCase();
}

// Index of the first company matching the target - by company id when both
// have one, otherwise by name (ignoring case) - or -1 when none matches.
export function findSelectedCompanyIndex(companies, target) {
  if (!target) return -1;

  if (target.companyId) {
    const index = companies.findIndex((company) => company.companyId === target.companyId);
    if (index !== -1) return index;
  }

  const targetName = normalizeName(target.companyName);
  if (!targetName) return -1;
  return companies.findIndex((company) => normalizeName(company.companyName) === targetName);
}
