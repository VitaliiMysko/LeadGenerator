import { syncGet, syncSet } from "../../utils/chrome-storage.js";
import { DEFAULT_LEADS_EXPORT_FORMAT } from "../../../constants/config.js";

export async function initExportFormat() {
  const selectElement = document.getElementById("export-format-settings");
  if (selectElement == null) return;

  selectElement.value = (await syncGet("leadsExportFormat")) || DEFAULT_LEADS_EXPORT_FORMAT;

  selectElement.addEventListener("change", async (e) => {
    await syncSet("leadsExportFormat", e.target.value);
  });
}
