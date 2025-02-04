import {
  jobPositionElement,
  companyNameElement,
  experienceContainerElement,
} from "../../helper/dom-helper.js";

export function createRadioCompanyList(experience) {
  experienceContainerElement.innerHTML = "";

  experience.forEach((company, index) => {
    const radioCompanyBlock = getRadioCompanyBlock(company, index);
    experienceContainerElement.appendChild(radioCompanyBlock);
  });
}

function getRadioCompanyBlock(company, index) {
  const radioCompanyBlock = document.createElement("div");
  radioCompanyBlock.classList.add("radio-company");

  const radioItem = getCompanyRadioElement(company);
  const companyLabelElement = getCompanyLabelElement(company);
  const companyJobElement = getCompanyJobElement(company);
  const companyWebsiteElement = getCompanyWebsiteElement();

  if (index === 0) {
    radioItem.checked = true;
    jobPositionElement.value = companyJobElement.textContent;
    companyNameElement.value = company.companyName;
  }

  radioItem.addEventListener("change", () => {
    if (radioItem.checked) {
      jobPositionElement.value = companyJobElement.textContent;
      companyNameElement.value = company.companyName;
    }
  });

  radioCompanyBlock.appendChild(radioItem);
  radioCompanyBlock.appendChild(companyLabelElement);
  radioCompanyBlock.appendChild(companyJobElement);
  radioCompanyBlock.appendChild(companyWebsiteElement);
  return radioCompanyBlock;
}

function getCompanyRadioElement(company) {
  const radioItem = document.createElement("input");
  radioItem.type = "radio";
  radioItem.name = "options";
  radioItem.id = `radio-company-${company.id}`;
  radioItem.value = company.id;
  return radioItem;
}

function getCompanyLabelElement(company) {
  const label = document.createElement("label");
  label.setAttribute("for", `radio-company-${company.id}`);
  label.classList.add("company-name");

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

function getCompanyJobElement(company) {
  const jobElement = document.createElement("div");
  jobElement.classList.add("company-job");
  jobElement.textContent = company.jobPosition;
  return jobElement;
}

function getCompanyWebsiteElement() {
  const websiteElement = document.createElement("div");
  websiteElement.classList.add("company-website");
  return websiteElement;
}
