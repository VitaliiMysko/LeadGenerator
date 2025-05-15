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

function getCompanyIndustryElement(){
  return document.querySelector("#company-industry");
}

function getTranslateBtnElement() {
  return document.getElementById("translate-btn");
}

function getGenerateEmailsBtnElement() {
  return document.getElementById("generate-emails-btn");
}

function getGetBtnElement() {
  return document.getElementById("get-btn");
}

function getCopyBtnElement() {
  return document.getElementById("copy-btn");
}

function getCopyToFileBtnElement() {
  return document.getElementById("copy-to-file-btn");
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

function getAppVerionElement() {
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

export function getCompanyIndustryElements() {
  return document.querySelectorAll(".company-industry");
}

export function getCompanyDomainElement() {
  return document.querySelector("div.company-website.active > span");
}

export const jobPositionElement = getJobPositionElement();
export const emailElement = getEmailElement();
export const companyNameElement = getCompanyNameElement();
export const companyIndustryElement = getCompanyIndustryElement();
export const translateBtnElement = getTranslateBtnElement();
export const getBtnElement = getGetBtnElement();
export const copyBtnElement = getCopyBtnElement();
export const copyToFileBtnElement = getCopyToFileBtnElement();
export const dataContainerElement = getDataContainerElement();
export const alertElement = getAlertElement();
export const experienceContainerElement = getExperienceContainerElement();
export const appVerionElement = getAppVerionElement();
export const generateEmailsBtnElement = getGenerateEmailsBtnElement();
