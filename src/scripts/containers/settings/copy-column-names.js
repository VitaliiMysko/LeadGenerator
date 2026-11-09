import { syncGet, syncSet } from "../../utils/chrome-storage.js";
import { DEFAULT_COPY_COLUMN_NAMES } from "../../../constants/config.js";

export async function initCopyColumnNames() {
  const settingsElement = document.getElementById("copy-column-names-settings");
  if (settingsElement == null) return;

  settingsElement.checked = !!(await syncGet("copyColumnNamesEnabled", DEFAULT_COPY_COLUMN_NAMES));

  settingsElement.addEventListener("change", async (e) => {
    await syncSet("copyColumnNamesEnabled", e.target.checked);
  });
}
