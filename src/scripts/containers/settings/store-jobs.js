import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initStoreJobs() {
  const settingsElement = document.getElementById("store-jobs-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("storeJobsEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("storeJobsEnabled", e.target.checked);
  });
}
