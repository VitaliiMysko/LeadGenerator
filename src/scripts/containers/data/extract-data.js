import {
  getExtractBtnElement,
  getTabExperienceElement,
} from "../../helper/dom-helper.js";
import { transliterateElement } from "../../services/transliteration.js";
import { createCompanyList } from "../experience/actual-experience.js";
import { handlerCompanyDetails } from "../experience/company-details.js";
import { applyFilters } from "../filters/filters-engine.js";
import { updateSaveBtnState } from "./storage-actions.js";

getExtractBtnElement().addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [
      "src/utils/mutation-observer.js",
      "src/content-scripts/common/constants.js",
      "src/content-scripts/sales-navigator-pages/lead/lead.js",
      "src/content-scripts/sales-navigator-pages/lead/lead-experience.js",
      "src/content-scripts/actions/extract-data.js",
    ],
  });

  const loadingElement = document.createElement("div");
  loadingElement.textContent = "Loading";
  loadingElement.classList.add("loading", "loading-text");
  getTabExperienceElement().appendChild(loadingElement);

  const results = await chrome.tabs.sendMessage(tab.id, { action: "extractData" });

  getTabExperienceElement().innerHTML = "";

  if (results) {
    for (const element of results.data) {
      if (element.category === "personalData") {
        await populateGeneralData(element.value);
        updateSaveBtnState();
      }
      if (element.category === "actualExperienceData") {
        createCompanyList(element.value);
      }
    }
  }

  applyFilters();
  handlerCompanyDetails();
});

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
