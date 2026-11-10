import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initGetCompanyWebsite() {
  const settingsElement = document.getElementById("get-company-website-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("getCompanyWebsiteEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("getCompanyWebsiteEnabled", e.target.checked);
  });
}
