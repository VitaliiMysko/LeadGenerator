import { syncGet, syncSet } from "../../utils/chrome-storage.js";

export async function initGetCompanyMembers() {
  const settingsElement = document.getElementById("get-company-members-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("getCompanyMembersEnabled"));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("getCompanyMembersEnabled", e.target.checked);
  });
}
