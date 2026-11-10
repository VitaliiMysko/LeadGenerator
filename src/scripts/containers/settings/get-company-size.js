import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initGetCompanySize() {
  const settingsElement = document.getElementById("get-company-size-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("getCompanySizeEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("getCompanySizeEnabled", e.target.checked);
  });
}
