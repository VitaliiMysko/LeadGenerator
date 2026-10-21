function normalizeName(name) {
  return (name || "").trim().toLowerCase();
}

function matchesCompanyCacheEntry(entry, companyId, companyName) {
  if (companyId) return entry.companyId === companyId;
  if (companyName) return normalizeName(entry.companyName) === normalizeName(companyName);
  return false;
}

export function upsertCompanyCacheEntry(entries, companyId, companyName, data, maxSize) {
  if (!companyId) return entries;
  const filtered = entries.filter((entry) => entry.companyId !== companyId);
  filtered.unshift({ companyId, companyName, data });
  return filtered.slice(0, maxSize);
}

export function findCompanyCacheEntry(entries, companyId, companyName) {
  if (!companyId && !companyName) return undefined;
  return entries.find((entry) => matchesCompanyCacheEntry(entry, companyId, companyName))?.data;
}

export function removeCompanyCacheEntry(entries, companyId) {
  if (!companyId) return entries;
  return entries.filter((entry) => entry.companyId !== companyId);
}

export function updateCompanyCacheEntryWebsite(entries, companyId, companyName, website) {
  return updateCompanyCacheEntryData(entries, companyId, companyName, { website });
}

export function updateCompanyCacheEntryOpenJobs(entries, companyId, companyName, openJobTitles) {
  return updateCompanyCacheEntryData(entries, companyId, companyName, { openJobTitles });
}

function updateCompanyCacheEntryData(entries, companyId, companyName, changes) {
  if (!companyId && !companyName) return entries;

  let matched = false;
  const updated = entries.map((entry) => {
    if (!matched && matchesCompanyCacheEntry(entry, companyId, companyName)) {
      matched = true;
      return { ...entry, data: { ...entry.data, ...changes } };
    }
    return entry;
  });

  return matched ? updated : entries;
}
