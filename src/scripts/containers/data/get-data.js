import {
  getBtnElement,
  experienceContainerElement,
} from "../../helper/dom-helper.js";
import { transliterateElement } from "../../services/transliteration.js";
import { createRadioCompanyList } from "../experience/actual-experience.js";
import { handlerCompanyDetails } from "../experience/company-details.js";

getBtnElement.addEventListener("click", () => {
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
        loadindElement.classList.add("loading");
        experienceContainerElement.appendChild(loadindElement);

        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getData" },
          async (results) => {
            experienceContainerElement.innerHTML = "";
            if (results) {
              const data = results.data;
              for (const element of data) {
                if (element.category === "personalData") {
                  await populateGeneralData(element.value);
                }
                if (element.category === "actualExperienceData") {
                  createRadioCompanyList(element.value);
                }
              }
            }
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
