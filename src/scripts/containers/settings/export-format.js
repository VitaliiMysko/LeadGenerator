import { syncGet, syncSet } from "../../utils/chrome-storage.js";
import { DEFAULT_LEADS_EXPORT_FORMAT } from "../../../constants/config.js";

export async function initExportFormat() {
  const containerElement = document.getElementById("export-format-settings");
  if (containerElement == null) return;

  const radioElements = containerElement.querySelectorAll('input[type="radio"]');
  const current = (await syncGet("leadsExportFormat")) || DEFAULT_LEADS_EXPORT_FORMAT;

  radioElements.forEach((radioElement) => {
    radioElement.checked = radioElement.value === current;
    radioElement.addEventListener("change", async () => {
      if (radioElement.checked) await syncSet("leadsExportFormat", radioElement.value);
    });
  });
}
