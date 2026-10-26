window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.selectedLeadCompanyInit) {
  // On people search, the company the selected lead was found under: shown in
  // the lead's result row (next to the job title), or once above the results
  // when they all belong to one company. Elements are found by their
  // data-anonymize attributes, which don't depend on the interface language.
  const PEOPLE_SEARCH_PATH = "/sales/search/people";
  const LEAD_NAME_SELECTOR = "h1[data-x--lead--name]";
  const PERSON_NAME_SELECTOR = '[data-anonymize="person-name"]';
  const COMPANY_NAME_SELECTOR = '[data-anonymize="company-name"]';

  function getSelectedLeadCompany() {
    if (!window.location.pathname.startsWith(PEOPLE_SEARCH_PATH)) return null;

    const leadNameElement = document.querySelector(LEAD_NAME_SELECTOR);
    if (!leadNameElement) return null;

    const rows = getResultRows(leadNameElement);
    const leadName = normalizeSpace(leadNameElement.textContent);
    const selectedRow = rows.find(
      (row) => normalizeSpace(row.querySelector(PERSON_NAME_SELECTOR).textContent) === leadName,
    );

    const companyElement =
      selectedRow?.querySelector(COMPANY_NAME_SELECTOR) ??
      getResultsHeaderCompany(leadNameElement, rows, selectedRow ?? rows[0]);

    return companyElement ? toCompany(companyElement) : null;
  }

  // Result rows: the list items holding a lead's name, other than the lead
  // side panel's own heading.
  function getResultRows(leadNameElement) {
    const rows = [...document.querySelectorAll(PERSON_NAME_SELECTOR)]
      .filter((element) => element !== leadNameElement)
      .map((element) => element.closest("li"))
      .filter(Boolean);
    return [...new Set(rows)];
  }

  // A company outside the result rows and outside the lead side panel (whose
  // experience also names companies) - the one shown above the results.
  function getResultsHeaderCompany(leadNameElement, rows, anyRow) {
    if (!anyRow) return null;
    const sidePanel = getSidePanel(leadNameElement, anyRow);

    return [...document.querySelectorAll(COMPANY_NAME_SELECTOR)].find(
      (element) => !sidePanel.contains(element) && !rows.some((row) => row.contains(element)),
    );
  }

  // The outermost ancestor of the lead's heading that doesn't also hold the
  // results, found without relying on LinkedIn's (hashed) class names.
  function getSidePanel(leadNameElement, row) {
    let sidePanel = leadNameElement;
    while (sidePanel.parentElement && !sidePanel.parentElement.contains(row)) {
      sidePanel = sidePanel.parentElement;
    }
    return sidePanel;
  }

  function toCompany(companyElement) {
    const link = companyElement.closest("a")?.href || companyElement.querySelector("a")?.href || "";
    return {
      companyId: link.match(/\/sales\/company\/(\d+)/)?.[1] || "",
      companyName: normalizeSpace(companyElement.textContent),
    };
  }

  function normalizeSpace(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  window.leadGenerator.getSelectedLeadCompany = getSelectedLeadCompany;
  window.leadGenerator.selectedLeadCompanyInit = true;
}
