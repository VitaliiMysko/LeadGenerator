export const DEFAULT_MAX_SAVED_LEADS = 99;
export const MAX_SAVED_LEADS_LIMIT = 9999;
export const MAX_CACHED_COMPANIES = 10;
export const NO_WEBSITE_FOUND_TEXT = "No website found";

export function getWorkerUrl() {
  return chrome.runtime.getManifest().host_permissions.find(
    (url) => !url.includes("linkedin.com"),
  );
}
