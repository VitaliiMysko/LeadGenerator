import {
  getBtnElement,
  experienceContainerElement,
} from "../../helper/dom-helper.js";
import { createRadioCompanyList } from "../experience/actual-experience.js";
import { handlerCompanyDetails } from "../experience/company-details.js";
import { getFromStorage } from "../settings/common.js";

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
              const transliterationEnabled = !!(await getFromStorage(
                "transliterationEnabled",
              ));

              const data = results.data;
              for (const element of data) {
                if (element.category === "personalData") {
                  populateGeneralData(element.value, transliterationEnabled);
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

function populateGeneralData(items, transliterationEnabled) {
  items.forEach((item) => {
    const inputElement = document.querySelector(`#${item.inputId}`);
    const value = item.value;

    if (item.inputId == "first-name" || item.inputId == "second-name") {
      const baseTransliterated = transliterate(value);
      const attributeValue = hasGermanLetters(value)
        ? transliterate(transliterateGermanLetters(value))
        : baseTransliterated;
      inputElement.value = transliterationEnabled ? baseTransliterated : value;
      inputElement.setAttribute(`data-${item.inputId}`, attributeValue);
    } else {
      inputElement.value = value;
    }
  });
}

function hasGermanLetters(text) {
  return /[äöüÄÖÜ]/.test(text);
}

function transliterateGermanLetters(text) {
  const map = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
  };

  return text.replace(/[äöüÄÖÜ]/g, (match) => map[match]);
}

const inputs = [
  { id: "first-name", dataAttr: "data-first-name" },
  { id: "second-name", dataAttr: "data-second-name" },
];

inputs.forEach(({ id, dataAttr }) => {
  const input = document.getElementById(id);

  input.addEventListener("change", () => {
    const value = input.value;
    if (value) {
      input.setAttribute(`${dataAttr}`, value);
    }
  });
});
