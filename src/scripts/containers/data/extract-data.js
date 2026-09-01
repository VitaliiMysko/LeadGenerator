import {
  getExtractBtnElement,
  getTabExperienceElement,
} from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";
import { transliterateElement } from "../../services/transliteration.js";
import { getLinkedInPageType } from "../../../utils/linkedin-page.js";
import { createCompanyList } from "../experience/actual-experience.js";
import { setupCompanyDetails } from "../experience/company-details.js";
import { applyFilters } from "../filters/filters-engine.js";
import { updateSaveBtnState } from "./storage-actions.js";

const FILE_SETS = {
  salesNavigatorLead: [
    "src/utils/mutation-observer.js",
    "src/content-scripts/common/constants.js",
    "src/content-scripts/common/name-utils.js",
    "src/content-scripts/sales-navigator-pages/lead/lead.js",
    "src/content-scripts/sales-navigator-pages/lead/lead-experience.js",
    "src/content-scripts/actions/extract-data.js",
  ],
  linkedinProfile: [
    "src/utils/mutation-observer.js",
    "src/content-scripts/common/constants.js",
    "src/content-scripts/common/name-utils.js",
    "src/content-scripts/linkedin-pages/lead/lead.js",
    "src/content-scripts/linkedin-pages/lead/lead-experience.js",
    "src/content-scripts/actions/extract-data-linkedin.js",
  ],
};

// Stable for the lifetime of this popup window, mirroring company-data.js's popupSessionId.
const profileExperienceSessionId = crypto.randomUUID();

getExtractBtnElement().addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const pageType = getLinkedInPageType(tab.url);
  if (!pageType) {
    showAlert(
      "Open a LinkedIn Sales Navigator lead page or a LinkedIn profile page first.",
      "error",
    );
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: FILE_SETS[pageType],
  });

  const loadingElement = document.createElement("div");
  loadingElement.textContent = "Loading";
  loadingElement.classList.add("loading", "loading-text");
  getTabExperienceElement().appendChild(loadingElement);

  const results = await chrome.tabs.sendMessage(tab.id, { action: "extractData" });

  getTabExperienceElement().innerHTML = "";

  if (results) {
    let actualExperienceData = [];
    let needsFullExperience = { needed: false, url: "" };

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
    }

    if (needsFullExperience.needed) {
      const fullExperienceData = await fetchFullProfileExperience(needsFullExperience.url);
      if (fullExperienceData) actualExperienceData = fullExperienceData;
    }

    createCompanyList(actualExperienceData);
  }

  applyFilters();
  setupCompanyDetails();
});

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
