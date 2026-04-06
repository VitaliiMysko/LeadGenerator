import { showAppsVersion } from "./helper/general.js";
import { initSettings } from "./containers/settings/main.js";

document.addEventListener("DOMContentLoaded", async () => {
  showAppsVersion();

  await initSettings();
});
