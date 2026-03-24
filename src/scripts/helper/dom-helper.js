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

function getGetBtnElement() {
  return document.getElementById("get-btn");
}

function getCopyBtnElement() {
  return document.getElementById("copy-btn");
}

function getDataContainerElement() {
  return document.getElementById("data-container");
}

function getAlertElement() {
  return document.getElementById("alert");
}

function getExperienceContainerElement() {
  return document.getElementById("experience-container");
}

function getAppVersionElement() {
  return document.getElementById("app-version");
}

export function getRadioButtonElements() {
  return document.querySelectorAll("#experience-container input[type='radio']");
}

export function getCompanyNameElements() {
  return document.querySelectorAll(".company-name");
}

export function getCompanyJobElements() {
  return document.querySelectorAll(".company-job");
}

export function getCompanyWebsiteElements() {
  return document.querySelectorAll(".company-website");
}

export function getCompanyLocationElements() {
  return document.querySelectorAll(".company-location");
}

export function getCompanyIndustryElements() {
  return document.querySelectorAll(".company-industry");
}

export function getCompanySizeElements() {
  return document.querySelectorAll(".company-size");
}

export function getCompanyDomainElement() {
  return document.querySelector("div.company-website.active > span");
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

export const jobPositionElement = getJobPositionElement();
export const emailElement = getEmailElement();
export const companyNameElement = getCompanyNameElement();
export const companyIndustryElement = getCompanyIndustryElement();
export const companyCountryElement = getCompanyCountryElement();
export const translateBtnElement = getTranslateBtnElement();
export const getBtnElement = getGetBtnElement();
export const copyBtnElement = getCopyBtnElement();
export const dataContainerElement = getDataContainerElement();
export const alertElement = getAlertElement();
export const experienceContainerElement = getExperienceContainerElement();
export const appVersionElement = getAppVersionElement();
export const generateEmailsBtnElement = getGenerateEmailsBtnElement();
export const validateEmailsBtnElement = getValidateEmailsBtnElement();
