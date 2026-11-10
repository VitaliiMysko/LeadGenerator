// A company's member count as saved with a lead: the plain number of
// LinkedIn members ("75045"), or "" when it is missing or not loaded yet.
export function normalizeCompanyMembers(members) {
  return typeof members === "string" && /^\d+$/.test(members) ? String(Number(members)) : "";
}
