import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initStoreCompanyId() {
  const settingsElement = document.getElementById("store-company-id-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("storeCompanyIdEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("storeCompanyIdEnabled", e.target.checked);
  });
}
