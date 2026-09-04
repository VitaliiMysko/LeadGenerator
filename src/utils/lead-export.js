export function buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId) {
  const record = {};
  fieldOrder.forEach((id) => {
    const key = keyMap[id];
    record[key] = lead[key] || "";
  });
  if (includeCompanyId) record.companyId = lead.companyId || "";
  return record;
}

export function formatLeadsAsTsv(leads, fieldOrder, keyMap, includeCompanyId) {
  return leads
    .map((lead) => Object.values(buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId)).join("\t"))
    .join("\n");
}

export function formatLeadsAsJson(leads, fieldOrder, keyMap, includeCompanyId) {
  return JSON.stringify(
    leads.map((lead) => buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId)),
    null,
    2,
  );
}
