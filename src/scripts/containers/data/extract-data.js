import {
  extractBtnElement,
  tabExperienceElement,
} from "../../helper/dom-helper.js";
import { transliterateElement } from "../../services/transliteration.js";
import { createCompanyList } from "../experience/actual-experience.js";
import { handlerCompanyDetails } from "../experience/company-details.js";
import { applyFilters } from "../filters/filters-engine.js";
import { updateSaveBtnState } from "./storage-actions.js";

extractBtnElement.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: [
          "src/utils/mutation-observer.js",
          "src/content-scripts/common/constants.js",
          "src/content-scripts/sales-navigator-pages/lead/lead.js",
          "src/content-scripts/sales-navigator-pages/lead/lead-experience.js",
          "src/content-scripts/actions/extract-data.js",
        ],
      },
      () => {
        const loadindElement = document.createElement("div");
        loadindElement.textContent = "Loading";
        loadindElement.classList.add("loading", "loading-text");
        tabExperienceElement.appendChild(loadindElement);

        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "extractData" },
          async (results) => {
            tabExperienceElement.innerHTML = "";
            if (results) {
              const data = results.data;
              for (const element of data) {
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
            await handlerCompanyDetails();
          },
        );
      },
    );
  });
});

async function populateGeneralData(items) {
  for (const item of items) {
    const inputElement = document.querySelector(`#${item.inputId}`);
    const value = item.value;
    inputElement.value = value;

    if (item.inputId == "first-name" || item.inputId == "second-name") {
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
