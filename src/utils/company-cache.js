export function upsertCompanyCacheEntry(entries, companyId, data, maxSize) {
  if (!companyId) return entries;
  const filtered = entries.filter((entry) => entry.companyId !== companyId);
  filtered.unshift({ companyId, data });
  return filtered.slice(0, maxSize);
}

export function findCompanyCacheEntry(entries, companyId) {
  if (!companyId) return undefined;
  return entries.find((entry) => entry.companyId === companyId)?.data;
}

export function removeCompanyCacheEntry(entries, companyId) {
  if (!companyId) return entries;
  return entries.filter((entry) => entry.companyId !== companyId);
}
