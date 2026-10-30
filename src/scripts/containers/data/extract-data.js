import {
  getExtractBtnElement,
  getTabExperienceElement,
} from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";
import { transliterateElement } from "../../services/transliteration.js";
import { getLinkedInPageType } from "../../../utils/linkedin-page.js";
import { createCompanyList, selectMatchingCompany } from "../experience/actual-experience.js";
import { setupCompanyDetails } from "../experience/company-details.js";
import { applyFilters } from "../filters/filters-engine.js";
import { updateSaveBtnState } from "./storage-actions.js";
import { getPanelTab, injectScripts, sendMessageToTab } from "../../services/tab-bridge.js";
import { resetLeadData, getLeadGeneration } from "../panel/lead-reset.js";

const FILE_SETS = {
  salesNavigatorLead: [
    "src/utils/mutation-observer.js",
    "src/utils/experience-period.js",
    "src/content-scripts/common/constants.js",
    "src/content-scripts/common/name-utils.js",
    "src/content-scripts/sales-navigator-pages/lead/lead.js",
    "src/content-scripts/sales-navigator-pages/lead/lead-experience.js",
    "src/content-scripts/sales-navigator-pages/search/selected-lead-company.js",
    "src/content-scripts/actions/extract-data.js",
  ],
  linkedinProfile: [
    "src/utils/mutation-observer.js",
    "src/utils/experience-period.js",
    "src/content-scripts/common/constants.js",
    "src/content-scripts/common/name-utils.js",
    "src/content-scripts/linkedin-pages/lead/lead.js",
    "src/content-scripts/linkedin-pages/lead/lead-experience.js",
    "src/content-scripts/actions/extract-data-linkedin.js",
  ],
};

// Stable for the lifetime of this panel document, mirroring company-data.js's panelSessionId.
const profileExperienceSessionId = crypto.randomUUID();

getExtractBtnElement().addEventListener("click", extractLead);

// The Extract button's action, also run by the companion API. Resolves once
// the lead's fields and the selected company's details have loaded, with
// { ok, reason }: not ok when the page isn't a LinkedIn lead page, nothing
// was extracted, or another lead was selected meanwhile.
export async function extractLead() {
  const tab = await getPanelTab();

  const pageType = getLinkedInPageType(tab.url);
  if (!pageType) {
    showAlert("Open a LinkedIn page first.", "error");
    return { ok: false, reason: "not a LinkedIn lead page" };
  }

  // Every Extract starts from an empty panel, so nothing from the previously
  // extracted lead (fields, companies, their pending lookups) carries over.
  resetLeadData();
  const generation = getLeadGeneration();

  await injectScripts(tab.id, FILE_SETS[pageType]);

  const loadingElement = document.createElement("div");
  loadingElement.textContent = "Loading";
  loadingElement.classList.add("loading", "loading-text");
  getTabExperienceElement().appendChild(loadingElement);

  const results = await sendMessageToTab(tab.id, { action: "extractData" });
  // Superseded by a newer Extract, or another lead was selected meanwhile.
  if (generation !== getLeadGeneration()) return { ok: false, reason: "superseded" };

  // "Loading" stays until the list is rendered - createCompanyList replaces
  // it - so it also covers the wait for the full list from the details page.
  if (!results) getTabExperienceElement().innerHTML = "";

  if (results) {
    let actualExperienceData = [];
    let needsFullExperience = { needed: false, url: "" };
    let selectedLeadCompany = null;

    for (const element of results.data) {
      if (element.category === "personalData") {
        await populateGeneralData(element.value);
        updateSaveBtnState();
      }
      if (element.category === "actualExperienceData") {
        actualExperienceData = element.value;
      }
      if (element.category === "needsFullExperience") {
        needsFullExperience = element.value;
      }
      if (element.category === "selectedLeadCompany") {
        selectedLeadCompany = element.value;
      }
    }

    if (needsFullExperience.needed) {
      const fullExperienceData = await fetchFullProfileExperience(needsFullExperience.url);
      if (generation !== getLeadGeneration()) return { ok: false, reason: "superseded" };
      // The full list is only requested when the short one found current
      // positions, so an empty result means the fetch failed - keep the
      // short list rather than wiping it.
      if (fullExperienceData?.length) actualExperienceData = fullExperienceData;
    }

    createCompanyList(actualExperienceData);
    // On people search, start on the company the lead was found under, so
    // its details load first; otherwise the first visible one is selected.
    selectMatchingCompany(selectedLeadCompany);
  }

  applyFilters();
  await setupCompanyDetails();
  if (!results) return { ok: false, reason: "nothing extracted from the page" };
  if (generation !== getLeadGeneration()) return { ok: false, reason: "superseded" };
  return { ok: true };
}

async function fetchFullProfileExperience(url) {
  return chrome.runtime
    .sendMessage({
      action: "fetchLinkedinProfileExperience",
      sessionId: profileExperienceSessionId,
      url,
    })
    .catch(() => null);
}

async function populateGeneralData(items) {
  for (const item of items) {
    const inputElement = document.querySelector(`#${item.inputId}`);
    inputElement.value = item.value;

    if (item.inputId === "first-name" || item.inputId === "second-name") {
      await transliterateElement(inputElement);
    }
  }
}

const nameIds = ["first-name", "second-name"];

for (const nameId of nameIds) {
  const inputNameElement = document.getElementById(nameId);

  inputNameElement.addEventListener("change", async () => {
    await transliterateElement(inputNameElement);
  });
}
