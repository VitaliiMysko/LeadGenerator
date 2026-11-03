import { trimAsciiWhitespace } from "./text-utils.js";

function normalizeName(name) {
  return trimAsciiWhitespace(name || "").toLowerCase();
}

// A position listed without a company link (e.g. a second role at the same
// company) borrows the link of another position with the same company name
// (ignoring case), so it loads the same company details. Left without one when
// positions with that name link to different companies.
export function fillMissingCompanyLinks(experience) {
  const linksByName = new Map();
  experience.forEach(({ companyName, companyLink }) => {
    const name = normalizeName(companyName);
    if (!name || !companyLink) return;
    if (!linksByName.has(name)) linksByName.set(name, new Set());
    linksByName.get(name).add(companyLink);
  });

  return experience.map((company) => {
    if (company.companyLink) return company;
    const links = linksByName.get(normalizeName(company.companyName));
    return links?.size === 1 ? { ...company, companyLink: [...links][0] } : company;
  });
}
