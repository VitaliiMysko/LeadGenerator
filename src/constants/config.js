export const DEFAULT_MAX_SAVED_LEADS = 99;
export const MAX_SAVED_LEADS_LIMIT = 999;
export const MAX_CACHED_COMPANIES = 10;
export const NO_WEBSITE_FOUND_TEXT = "No website found";
export const LEADS_EXPORT_FORMATS = { TSV: "tsv", JSON: "json" };
export const DEFAULT_LEADS_EXPORT_FORMAT = LEADS_EXPORT_FORMATS.TSV;
// Whether the tab-separated export starts with a row of column names.
export const DEFAULT_COPY_COLUMN_NAMES = true;

// Kept in sync with manifest.json's host_permissions (as `${WORKER_URL}/*`)
// and background.js's WORKER_ORIGIN by a test.
export const WORKER_URL = "https://lead-generator-backend-worker.vitalij-musko.workers.dev";

// Extensions allowed to run the panel's Extract, Generate and Save through
// the companion API (companion-api.js): Leads Automate, by its Chrome Web
// Store id, its unpacked Chrome id (fixed by its manifest key) and its
// Firefox add-on id. Kept in sync with
// background.js's COMPANION_EXTENSION_IDS (which may open the panel) by a
// test.
export const COMPANION_EXTENSION_IDS = ["lfegeffagbapijjliibbjbcnihhcpkkp", "ofbkinmakmfacepccjcbmjgecdppolki", "leads-automate@future-processing.com"];

export function getWorkerUrl() {
  return WORKER_URL;
}
