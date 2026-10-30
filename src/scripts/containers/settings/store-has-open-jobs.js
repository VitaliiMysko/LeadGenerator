import { syncGet, syncSet } from "../../utils/chrome-storage.js";
import { initTagInput } from "../../components/tag-input.js";

export async function initStoreHasOpenJobs() {
  const settingsElement = document.getElementById("store-has-open-jobs-settings");
  if (settingsElement == null) return;

  const keywordsWrapper = document.getElementById("open-jobs-keywords-wrapper");

  settingsElement.checked = !!(await syncGet("storeHasOpenJobsEnabled"));
  keywordsWrapper.style.display = settingsElement.checked ? "" : "none";

  settingsElement.addEventListener("change", async (e) => {
    keywordsWrapper.style.display = e.target.checked ? "" : "none";
    await syncSet("storeHasOpenJobsEnabled", e.target.checked);
  });

  initTagInput({
    container: document.getElementById("open-jobs-keywords"),
    tags: await syncGet("openJobsKeywords", []),
    onChange: (keywords) => syncSet("openJobsKeywords", keywords),
  });
}
