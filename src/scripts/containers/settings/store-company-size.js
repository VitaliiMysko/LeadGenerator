import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initStoreCompanySize() {
  const settingsElement = document.getElementById("store-company-size-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("storeCompanySizeEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("storeCompanySizeEnabled", e.target.checked);
  });
}
