import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initStoreCompanyMembers() {
  const settingsElement = document.getElementById("store-company-members-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("storeCompanyMembersEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("storeCompanyMembersEnabled", e.target.checked);
  });
}
