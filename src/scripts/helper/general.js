import { getAppVersionElement } from "./dom-helper.js";

export async function showAppsVersion() {
  const appVersionElement = getAppVersionElement();
  if (!appVersionElement) return;

  const version = chrome.runtime.getManifest().version;
  appVersionElement.textContent = `v ${version}`;

  // Asked of the background: chrome.management isn't exposed to this framed
  // page in Firefox.
  const installType = await chrome.runtime
    .sendMessage({ action: "getInstallType" })
    .catch(() => null);
  if (installType === "development") {
    appVersionElement.textContent = `v ${version} (dev)`;
  }
}
