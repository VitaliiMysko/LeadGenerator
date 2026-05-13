export function getFirstNameElement() {
  return document.getElementById("first-name");
}

export function getSecondNameElement() {
  return document.getElementById("second-name");
}

function getJobPositionElement() {
  return document.getElementById("job-position");
}

function getEmailElement() {
  return document.getElementById("email");
}

function getCompanyNameElement() {
  return document.getElementById("company-name");
}

function getCompanyIndustryElement() {
  return document.querySelector("#company-industry");
}

function getCompanyCountryElement() {
  return document.querySelector("#company-country");
}

function getTranslateBtnElement() {
  return document.getElementById("translate-btn");
}

function getGenerateEmailsBtnElement() {
  return document.getElementById("generate-emails-btn");
}

function getValidateEmailsBtnElement() {
  return document.getElementById("validete-emails-btn");
}

function getOpenCompanyLinkedinBtnElement() {
  return document.getElementById("open-company-linkedin-btn");
}

function getLinkElement() {
  return document.getElementById("link");
}

function getExtractBtnElement() {
  return document.getElementById("extract-btn");
}

function getSaveBtnElement() {
  return document.getElementById("save-btn");
}

function getStorageLeadsBtnElement() {
  return document.getElementById("get-storage-leads-btn");
}

function getCleanBtnElement() {
  return document.getElementById("clean-btn");
}

function getDataContainerElement() {
  return document.getElementById("data-container");
}

function getAlertElement() {
  return document.getElementById("alert");
}

function getTabExperienceElement() {
  return document.getElementById("tab-experience");
}

function getAppVersionElement() {
  return document.getElementById("app-version");
}

export function getCompanyItemElements() {
  return document.querySelectorAll("#tab-experience .company-item");
}


export function getCompanyDomainElement() {
  return document.querySelector(".company-item.active .company-website > span");
}

export function getTabSelectorTriggerElement() {
  return document.querySelector(".tab-selector-trigger");
}

export function getTabDropdownElement() {
  return document.querySelector(".tab-dropdown");
}

export function getTabOptionElements() {
  return document.querySelectorAll(".tab-option");
}

export function getTabElements() {
  return document.querySelectorAll(".tab");
}

export function getDragAndDropSettingsElement() {
  return document.getElementById("drag-and-drop-settings");
}

export const firstNameElement = getFirstNameElement();
export const secondNameElement = getSecondNameElement();
export const linkElement = getLinkElement();
export const jobPositionElement = getJobPositionElement();
export const emailElement = getEmailElement();
export const companyNameElement = getCompanyNameElement();
export const companyIndustryElement = getCompanyIndustryElement();
export const companyCountryElement = getCompanyCountryElement();
export const translateBtnElement = getTranslateBtnElement();
export const extractBtnElement = getExtractBtnElement();
export const saveBtnElement = getSaveBtnElement();
export const storageLeadsBtnElement = getStorageLeadsBtnElement();
export const cleanBtnElement = getCleanBtnElement();
export const dataContainerElement = getDataContainerElement();
export const alertElement = getAlertElement();
export const tabExperienceElement = getTabExperienceElement();
export const appVersionElement = getAppVersionElement();
export const generateEmailsBtnElement = getGenerateEmailsBtnElement();
export const validateEmailsBtnElement = getValidateEmailsBtnElement();
export const openCompanyLinkedinBtnElement = getOpenCompanyLinkedinBtnElement();
