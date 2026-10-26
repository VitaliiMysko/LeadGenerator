export function extractCompanyId(companyLink) {
  if (!companyLink) return "";
  const match = companyLink.match(/\/company\/(\d+)/);
  return match ? match[1] : "";
}
