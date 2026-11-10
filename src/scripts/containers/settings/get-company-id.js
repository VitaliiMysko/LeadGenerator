import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initGetCompanyId() {
  const settingsElement = document.getElementById("get-company-id-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("getCompanyIdEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("getCompanyIdEnabled", e.target.checked);
  });
}
