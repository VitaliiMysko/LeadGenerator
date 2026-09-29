export const DEFAULT_MAX_SAVED_LEADS = 99;
export const MAX_SAVED_LEADS_LIMIT = 999;
export const MAX_CACHED_COMPANIES = 10;
export const NO_WEBSITE_FOUND_TEXT = "No website found";
export const LEADS_EXPORT_FORMATS = { TSV: "tsv", JSON: "json" };
export const DEFAULT_LEADS_EXPORT_FORMAT = LEADS_EXPORT_FORMATS.TSV;

// Kept in sync with manifest.json's host_permissions by a test. Not read from
// chrome.runtime.getManifest(): in Firefox the panel's framed page doesn't get
// the full host_permissions list there.
export const WORKER_URL = "https://lead-generator-backend-worker.vitalij-musko.workers.dev";

export function getWorkerUrl() {
  return WORKER_URL;
}
