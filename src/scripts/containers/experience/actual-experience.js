import {
  jobPositionElement,
  companyNameElement,
  experienceContainerElement,
} from "../../helper/dom-helper.js";

export function createRadioCompaniesList(experience) {
  experienceContainerElement.innerHTML = "";

  experience.forEach((company, index) => {
    const radioCompanyBlock = GetRadioCompanyBlock(company, index);
    experienceContainerElement.appendChild(radioCompanyBlock);
  });
}

function GetRadioCompanyBlock(company, index) {
  const radioCompanyBlock = document.createElement("div");
  radioCompanyBlock.classList.add("radio-company");

  const radioItem = GetCompanyRadioElement(company);
  const companyLabelElement = GetCompanyLabelElement(company);
  const currentCompanyJobElement = GetCurrentCompanyJobElement(company);
  const currentCompanyWebsiteElement = GetCurrentCompanyWebiteElement(company);

  if (index === 0) {
    radioItem.checked = true;
    jobPositionElement.value = currentCompanyJobElement.textContent;
    companyNameElement.value = company.companyName;
  }

  radioItem.addEventListener("change", () => {
    if (radioItem.checked) {
      jobPositionElement.value = currentCompanyJobElement.textContent;
      companyNameElement.value = company.companyName;
    }
  });

  radioCompanyBlock.appendChild(radioItem);
  radioCompanyBlock.appendChild(companyLabelElement);
  radioCompanyBlock.appendChild(currentCompanyJobElement);
  radioCompanyBlock.appendChild(currentCompanyWebsiteElement);
  return radioCompanyBlock;
}

function GetCompanyRadioElement(company) {
  const radioItem = document.createElement("input");
  radioItem.type = "radio";
  radioItem.name = "options";
  radioItem.id = `radio-company-${company.id}`;
  radioItem.value = company.id;
  return radioItem;
}

function GetCompanyLabelElement(company) {
  const label = document.createElement("label");
  label.setAttribute("for", `radio-company-${company.id}`);
  label.classList.add("current-company-name");

  if (company.companylink != "") {
    const link = document.createElement("a");
    link.href = company.companylink;
    link.textContent = company.companyName;

    label.appendChild(link);
  } else {
    label.textContent = company.companyName;
  }
  return label;
}

function GetCurrentCompanyJobElement(company) {
  const currentJobElement = document.createElement("div");
  currentJobElement.classList.add("current-company-job");
  currentJobElement.textContent = company.jobPosition;
  return currentJobElement;
}

function GetCurrentCompanyWebiteElement(company) {
  const currentWebSiteElement = document.createElement("div");
  currentWebSiteElement.classList.add("current-company-website");
  return currentWebSiteElement;
}
