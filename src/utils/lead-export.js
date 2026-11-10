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
  companySize: "Company size",
  companyMembers: "Company members",
  companyWebsite: "Company website",
  hasOpenJobs: "Has open jobs",
};

// Optional columns appended after the ordered fields, in this order, each
// only when its option is on.
const OPTIONAL_COLUMNS = [
  ["includeCompanyId", "companyId"],
  ["includeCompanySize", "companySize"],
  ["includeCompanyMembers", "companyMembers"],
  ["includeCompanyWebsite", "companyWebsite"],
  ["includeOpenJobs", "hasOpenJobs"],
];

export function buildLeadRecord(lead, fieldOrder, keyMap, options = {}) {
  const record = {};
  fieldOrder.forEach((id) => {
    const key = keyMap[id];
    record[key] = lead[key] || "";
  });
  OPTIONAL_COLUMNS.forEach(([option, key]) => {
    if (options[option]) record[key] = lead[key] || "";
  });
  return record;
}

// One line per lead, preceded by a header line with the column names
// unless options.includeHeader is false; "" when there are no leads.
export function formatLeadsAsTsv(leads, fieldOrder, keyMap, options = {}) {
  if (!leads.length) return "";
  const records = leads.map((lead) => buildLeadRecord(lead, fieldOrder, keyMap, options));
  const rows = records.map(Object.values);
  if (options.includeHeader !== false) {
    rows.unshift(Object.keys(records[0]).map((key) => LEAD_COLUMN_NAMES[key] || key));
  }
  return rows.map((row) => row.join("\t")).join("\n");
}

export function formatLeadsAsJson(leads, fieldOrder, keyMap, options = {}) {
  return JSON.stringify(
    leads.map((lead) => buildLeadRecord(lead, fieldOrder, keyMap, options)),
    null,
    2,
  );
}
