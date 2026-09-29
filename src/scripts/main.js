import { showAppsVersion } from "./helper/general.js";
import { initSettings } from "./containers/settings/main.js";
import { loadFilters } from "./store/filter-store.js";
import { initFilters } from "./containers/filters/filters-engine.js";
import { applyScrollbarFallback } from "./features/scrollbar-fallback.js";

document.addEventListener("DOMContentLoaded", async () => {
  showAppsVersion();
  applyScrollbarFallback(document.querySelector(".tabs-content"));

  await loadFilters();
  initFilters();

  await initSettings();
});
