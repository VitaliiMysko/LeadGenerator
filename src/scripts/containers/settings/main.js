import { initDragAndDrop } from "./drag-and-drop.js";
import { initTransliteration } from "./transliteration.js";
import { initFieldOrder } from "./field-order.js";
import { initCountryByDefault } from "./country-by-default.js";
import { initStoreCompanyId } from "./store-company-id.js";
import { initMaxSavedLeads } from "./max-saved-leads.js";
import { initExportFormat } from "./export-format.js";

export async function initSettings() {
  await initFieldOrder();
  await initDragAndDrop();
  await initTransliteration();
  await initCountryByDefault();
  await initStoreCompanyId();
  await initMaxSavedLeads();
  await initExportFormat();
}
