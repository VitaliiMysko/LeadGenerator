import { initDragAndDrop } from "./drag-and-drop.js";
import { initTransliteration } from "./transliteration.js";
import { initFieldOrder } from "./field-order.js";
import { initCountryByDefault } from "./country-by-default.js";
import { initStoreCompanyId } from "./store-company-id.js";
import { initStoreCompanySize } from "./store-company-size.js";
import { initStoreHasOpenJobs } from "./store-has-open-jobs.js";
import { initMaxSavedLeads } from "./max-saved-leads.js";
import { initExportFormat } from "./export-format.js";
import { initCopyColumnNames } from "./copy-column-names.js";

export async function initSettings() {
  await initFieldOrder();
  await initDragAndDrop();
  await initTransliteration();
  await initCountryByDefault();
  await initStoreCompanyId();
  await initStoreCompanySize();
  await initStoreHasOpenJobs();
  await initMaxSavedLeads();
  await initExportFormat();
  await initCopyColumnNames();
}
