import { getBtnElement } from "../../helper/dom-helper.js";
import { createRadioCompaniesList } from "../experience/actual-experience.js";
import { handlerCompanyWebsite } from "../experience/website.js";

getBtnElement.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: [
          "src/content-scripts/content.js",
          "src/content-scripts/personal-data.js",
          "src/content-scripts/experience-data.js",
          "src/content-scripts/extract-data.js",
        ],
      },
      () => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getData" },
          async (results) => {
            if (results) {
              const data = results.data;
              data.forEach(async (element) => {
                if (element.category === "personalData") {
                  populateGeneralData(element.value);
                }
                if (element.category === "actualExperienceData") {
                  createRadioCompaniesList(element.value);
                }
              });
            }
            await handlerCompanyWebsite();
          }
        );
      }
    );
  });
});

function populateGeneralData(items) {
  items.forEach((item) => {
    if (item.inputId == "first-name" || item.inputId == "second-name") {
      document.querySelector(`#${item.inputId}`).value = transliterate(
        item.value
      );
    } else {
      document.querySelector(`#${item.inputId}`).value = item.value;
    }
  });
}
