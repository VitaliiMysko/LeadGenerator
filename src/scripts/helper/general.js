import { getAppVersionElement } from "./dom-helper.js";

export function showAppsVersion() {
  const manifest = chrome.runtime.getManifest();
  const appVersionElement = getAppVersionElement();

  if (appVersionElement) {
    const environment = manifest.environment;
    const showEnvironment = environment ? ` (${environment})` : environment;
    appVersionElement.textContent = `v ${manifest.version}${showEnvironment}`;
  }
}
