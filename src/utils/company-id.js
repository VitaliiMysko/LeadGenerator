export function extractCompanyId(companyLink) {
  if (!companyLink) return "";
  const match = companyLink.match(/\/company\/(\d+)/);
  return match ? match[1] : "";
}

// Identifies a company across leads: the same company's link can differ from
// one lead to another (e.g. by query parameters), its id doesn't.
export function getCompanyCacheKey(companyLink, companyName) {
  return extractCompanyId(companyLink) || companyLink || companyName || "";
}
