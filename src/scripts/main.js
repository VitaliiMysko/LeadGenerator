import { showAppsVersion } from "./helper/general.js";
import { initSettings } from "./containers/settings/main.js";
import { loadFilters } from "./store/filter-store.js";
import { initFilters } from "./containers/filters/filters-engine.js";
import { initCustomScrollbar } from "./features/custom-scrollbar.js";

document.addEventListener("DOMContentLoaded", async () => {
  showAppsVersion();
  initCustomScrollbar(document.querySelector(".tabs-content"));

  await loadFilters();
  initFilters();

  await initSettings();
});
