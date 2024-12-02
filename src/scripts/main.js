import { getBtnElement } from "./dom-manager.js";
import { createRadioCompaniesList } from "./company-list.js";

getBtnElement.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["src/content-scripts/extract-data.js"],
      },
      () => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getData" },
          (results) => {
            if (results) {
              const data = results.data;
              data.forEach((element) => {
                if (element.category === "generalData") {
                  populateGeneralData(element.value);
                }
                if (element.category === "comany&jobPosition") {
                  createRadioCompaniesList(element.value);
                }
              });
            }
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
