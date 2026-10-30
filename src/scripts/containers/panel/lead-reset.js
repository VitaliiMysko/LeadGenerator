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
  getCompanyOpenJobTitlesElement,
  getTabExperienceElement,
  getGenerateEmailsBtnElement,
  getValidateEmailsBtnElement,
  getOpenCompanyLinkedinBtnElement,
} from "../../helper/dom-helper.js";
import { updateSaveBtnState } from "../data/storage-actions.js";

// Bumped on every reset, so work started for the previous lead (an Extract
// still waiting for the page) can tell it's stale and drop its result.
let leadGeneration = 0;

export function getLeadGeneration() {
  return leadGeneration;
}

export function resetLeadData() {
  leadGeneration++;

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
    getCompanyOpenJobTitlesElement(),
  ].forEach((element) => {
    element.value = "";
  });

  getTabExperienceElement().innerHTML = "";
  getGenerateEmailsBtnElement().disabled = true;
  getValidateEmailsBtnElement().disabled = true;
  getOpenCompanyLinkedinBtnElement().disabled = true;
  getOpenCompanyLinkedinBtnElement().dataset.href = "";
  updateSaveBtnState();
}
