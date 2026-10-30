export const DEFAULT_MAX_SAVED_LEADS = 99;
export const MAX_SAVED_LEADS_LIMIT = 999;
export const MAX_CACHED_COMPANIES = 10;
export const NO_WEBSITE_FOUND_TEXT = "No website found";
export const LEADS_EXPORT_FORMATS = { TSV: "tsv", JSON: "json" };
export const DEFAULT_LEADS_EXPORT_FORMAT = LEADS_EXPORT_FORMATS.TSV;

// Kept in sync with manifest.json's host_permissions (as `${WORKER_URL}/*`)
// and background.js's WORKER_ORIGIN by a test.
export const WORKER_URL = "https://lead-generator-backend-worker.vitalij-musko.workers.dev";

// Extensions allowed to run the panel's Extract, Generate and Save through
// the companion API (companion-api.js): Leads Automate, whose manifest key
// fixes its id.
export const COMPANION_EXTENSION_IDS = ["ofbkinmakmfacepccjcbmjgecdppolki"];

export function getWorkerUrl() {
  return WORKER_URL;
}
