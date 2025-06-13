import { getBtnElement } from "../../helper/dom-helper.js";
import { createRadioCompanyList } from "../experience/actual-experience.js";
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
                  createRadioCompanyList(element.value);
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
    const inputElement = document.querySelector(`#${item.inputId}`);
    const value = item.value;

    if (item.inputId == "first-name" || item.inputId == "second-name") {
      const baseTransliterated = transliterate(value);
      const attributeValue = hasGermanLetters(value)
        ? transliterate(transliterateGermanLetters(value))
        : baseTransliterated;

      inputElement.value = baseTransliterated;
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

  input.addEventListener("blur", () => {
    const value = input.value;
    if (value) {
      input.setAttribute(`${dataAttr}`, value);
    }
  });
});
