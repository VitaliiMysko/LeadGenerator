function getJobPositionElement() {
  return document.getElementById("job-position");
}

function getCompanyNameElement() {
  return document.getElementById("company-name");
}

function getTranslateBtnElement() {
  return document.getElementById("translate-btn");
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

function getAppVerionElement() {
  return document.getElementById("app-version");
}

export function getRadioButtonElements() {
  return document.querySelectorAll("#experience-container input[type='radio']");
}

export function getCompanyNameElements() {
  return document.querySelectorAll(".current-company-name");
}

export function getCompanyJobElements() {
  return document.querySelectorAll(".current-company-job");
}

export function getCompanyWebsiteElements() {
  return document.querySelectorAll(".current-company-website");
}

export const jobPositionElement = getJobPositionElement();
export const companyNameElement = getCompanyNameElement();
export const translateBtnElement = getTranslateBtnElement();
export const getBtnElement = getGetBtnElement();
export const copyBtnElement = getCopyBtnElement();
export const dataContainerElement = getDataContainerElement();
export const alertElement = getAlertElement();
export const experienceContainerElement = getExperienceContainerElement();
export const appVerionElement = getAppVerionElement();
