import { appVerionElement } from "./helper/dom-helper.js";

document.addEventListener("DOMContentLoaded", () => {
  const manifest = chrome.runtime.getManifest();

  if (appVerionElement) {
    const environment = manifest.environment;
    const showEnvironment = environment ? ` (${environment})` : environment;
    appVerionElement.textContent = `Version: ${manifest.version}${showEnvironment}`;
  }
});
