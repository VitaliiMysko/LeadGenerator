import { appVersionElement } from "./helper/dom-helper.js";

document.addEventListener("DOMContentLoaded", () => {
  const manifest = chrome.runtime.getManifest();

  if (appVersionElement) {
    const environment = manifest.environment;
    const showEnvironment = environment ? ` (${environment})` : environment;
    appVersionElement.textContent = `Version: ${manifest.version}${showEnvironment}`;
  }
});
