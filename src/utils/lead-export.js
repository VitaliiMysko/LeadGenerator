// Tab-separated export header: the same names as the panel's fields.
// A key without a name here (none today) falls back to the key itself.
export const LEAD_COLUMN_NAMES = {
  firstName: "Name",
  surname: "Surname",
  jobPosition: "Job position",
  link: "Link",
  email: "Email",
  companyName: "Company name",
  country: "Country",
  industry: "Industry",
  companyId: "Company id",
  hasOpenJobs: "Has open jobs",
};

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

// One line per lead, preceded by a header line with the column names
// unless includeHeader is false; "" when there are no leads.
export function formatLeadsAsTsv(
  leads,
  fieldOrder,
  keyMap,
  includeCompanyId,
  includeOpenJobs = false,
  includeHeader = true,
) {
  if (!leads.length) return "";
  const records = leads.map((lead) =>
    buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId, includeOpenJobs),
  );
  const rows = records.map(Object.values);
  if (includeHeader) rows.unshift(Object.keys(records[0]).map((key) => LEAD_COLUMN_NAMES[key] || key));
  return rows.map((row) => row.join("\t")).join("\n");
}

export function formatLeadsAsJson(leads, fieldOrder, keyMap, includeCompanyId, includeOpenJobs = false) {
  return JSON.stringify(
    leads.map((lead) => buildLeadRecord(lead, fieldOrder, keyMap, includeCompanyId, includeOpenJobs)),
    null,
    2,
  );
}
