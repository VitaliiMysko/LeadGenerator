export const DEFAULT_MAX_SAVED_LEADS = 99;
export const MAX_SAVED_LEADS_LIMIT = 999;
export const MAX_CACHED_COMPANIES = 10;
export const NO_WEBSITE_FOUND_TEXT = "No website found";
export const LEADS_EXPORT_FORMATS = { TSV: "tsv", JSON: "json" };
export const DEFAULT_LEADS_EXPORT_FORMAT = LEADS_EXPORT_FORMATS.TSV;

// Kept in sync with manifest.json's host_permissions (and background.js's
// WORKER_ORIGIN) by a test. Not read from chrome.runtime.getManifest():
// Firefox drops this path-less entry from host_permissions there.
export const WORKER_URL = "https://lead-generator-backend-worker.vitalij-musko.workers.dev";

export function getWorkerUrl() {
  return WORKER_URL;
}
