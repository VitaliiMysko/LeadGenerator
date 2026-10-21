import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initStoreHasOpenJobs() {
  const settingsElement = document.getElementById("store-has-open-jobs-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("storeHasOpenJobsEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("storeHasOpenJobsEnabled", e.target.checked);
  });
}
