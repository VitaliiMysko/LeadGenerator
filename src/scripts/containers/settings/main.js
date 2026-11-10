import { initDragAndDrop } from "./drag-and-drop.js";
import { initTransliteration } from "./transliteration.js";
import { initFieldOrder } from "./field-order.js";
import { initCountryByDefault } from "./country-by-default.js";
import { initGetCompanyId } from "./get-company-id.js";
import { initGetCompanySize } from "./get-company-size.js";
import { initGetCompanyMembers } from "./get-company-members.js";
import { initGetCompanyWebsite } from "./get-company-website.js";
import { initStoreHasOpenJobs } from "./store-has-open-jobs.js";
import { initMaxSavedLeads } from "./max-saved-leads.js";
import { initExportFormat } from "./export-format.js";
import { initCopyColumnNames } from "./copy-column-names.js";

export async function initSettings() {
  await initFieldOrder();
  await initDragAndDrop();
  await initTransliteration();
  await initCountryByDefault();
  await initGetCompanyId();
  await initGetCompanySize();
  await initGetCompanyMembers();
  await initGetCompanyWebsite();
  await initStoreHasOpenJobs();
  await initMaxSavedLeads();
  await initExportFormat();
  await initCopyColumnNames();
}
