export const MAX_SAVED_LEADS = 99;

export function getWorkerUrl() {
  return chrome.runtime.getManifest().host_permissions.find(
    (url) => !url.includes("linkedin.com"),
  );
}
