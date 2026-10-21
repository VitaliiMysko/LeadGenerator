export function buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId, includeOpenJobs = false) {
  const record = {};
  fieldOrder.forEach((id) => {
    const key = keyMap[id];
    record[key] = lead[key] || "";
  });
  if (includeCompanyId) record.companyId = lead.companyId || "";
  if (includeOpenJobs) record.hasOpenJobs = lead.hasOpenJobs || "";
  return record;
}

export function formatLeadsAsTsv(leads, fieldOrder, keyMap, includeCompanyId, includeOpenJobs = false) {
  return leads
    .map((lead) =>
      Object.values(buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId, includeOpenJobs)).join("\t"),
    )
    .join("\n");
}

export function formatLeadsAsJson(leads, fieldOrder, keyMap, includeCompanyId, includeOpenJobs = false) {
  return JSON.stringify(
    leads.map((lead) => buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId, includeOpenJobs)),
    null,
    2,
  );
}
