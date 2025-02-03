function GetJobPositionElement() {
  return document.getElementById("job-position");
}

function GetCompanyNameElement() {
  return document.getElementById("company-name");
}

function GetTranslateBtnElement() {
  return document.getElementById("translate-btn");
}

function GetGetBtnElement() {
  return document.getElementById("get-btn");
}

function GetCopyBtnElement() {
  return document.getElementById("copy-btn");
}

function GetDataContainerElement() {
  return document.getElementById("data-container");
}

function GetAlertElement() {
  return document.getElementById("alert");
}

function GetExperienceContainerElement() {
  return document.getElementById("experience-container");
}

function GetAppVerionElement() {
  return document.getElementById("app-version");
}

export function GetRadioButtonElements() {
  return document.querySelectorAll("#experience-container input[type='radio']");
}

export function GetCompanyNameElements() {
  return document.querySelectorAll(".current-company-name");
}

export function GetCompanyJobElements() {
  return document.querySelectorAll(".current-company-job");
}

export function GetCompanyWebsiteElements() {
  return document.querySelectorAll(".current-company-website");
}

export const jobPositionElement = GetJobPositionElement();
export const companyNameElement = GetCompanyNameElement();
export const translateBtnElement = GetTranslateBtnElement();
export const getBtnElement = GetGetBtnElement();
export const copyBtnElement = GetCopyBtnElement();
export const dataContainerElement = GetDataContainerElement();
export const alertElement = GetAlertElement();
export const experienceContainerElement = GetExperienceContainerElement();
export const appVerionElement = GetAppVerionElement();
