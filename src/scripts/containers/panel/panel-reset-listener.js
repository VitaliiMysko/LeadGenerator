import {
  getFirstNameElement,
  getSecondNameElement,
  getJobPositionElement,
  getLinkElement,
  getEmailElement,
  getCompanyNameElement,
  getCompanyCountryElement,
  getCompanyIndustryElement,
  getCompanyIdElement,
  getTabExperienceElement,
} from "../../helper/dom-helper.js";
import { updateSaveBtnState } from "../data/storage-actions.js";

const RESET_MESSAGE_TYPE = "lead-generator:panel-reset";
const PARENT_ORIGIN = "https://www.linkedin.com";

window.addEventListener("message", (event) => {
  if (event.origin !== PARENT_ORIGIN) return;
  if (event.data?.type !== RESET_MESSAGE_TYPE) return;
  resetExtractedData();
});

function resetExtractedData() {
  [
    getFirstNameElement(),
    getSecondNameElement(),
    getJobPositionElement(),
    getLinkElement(),
    getEmailElement(),
    getCompanyNameElement(),
    getCompanyCountryElement(),
    getCompanyIndustryElement(),
    getCompanyIdElement(),
  ].forEach((element) => {
    element.value = "";
  });

  getTabExperienceElement().innerHTML = "";
  updateSaveBtnState();
}
