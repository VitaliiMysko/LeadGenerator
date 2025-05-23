import {
  jobPositionElement,
  companyNameElement,
  companyIndustryElement,
  companyCountryElement,
  emailElement,
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
  const companyLabeRadiolElement = getCompanyLabelRadioElement(company);
  const companyJobRadioElement = getCompanyJobRadioElement(company);
  const companyWebsiteRadioElement = getCompanyWebsiteRadioElement();
  const companyIndustryRadioElement = getCompanyIndustryRadioElement();
  const companyLocationRadioElement = getCompanyLocationRadioElement();

  if (index === 0) {
    radioItem.checked = true;
    jobPositionElement.value = companyJobRadioElement.textContent;
    companyNameElement.value = company.companyName;
    companyIndustryElement.value = "";
    emailElement.value = "";
    companyIndustryElement.value = "";
    companyCountryElement.value = "";
  }

  radioItem.addEventListener("change", () => {
    if (radioItem.checked) {
      const parentDiv = radioItem.closest(".radio-company");
      jobPositionElement.value = companyJobRadioElement.textContent;
      companyNameElement.value = company.companyName;
      emailElement.value = "";
      let industryRadioItemValue = parentDiv.querySelector(".company-industry").firstChild?.textContent || "";
      companyIndustryElement.value = industryRadioItemValue == "No industry found" ? "" : industryRadioItemValue;
      let locationRadioElementValue = parentDiv.querySelector(".company-location").firstChild?.textContent || ""; 
      companyCountryElement.value = locationRadioElementValue == "No location found" ? "" : locationRadioElementValue.split(', ').pop();
    }
  });

  radioCompanyBlock.appendChild(radioItem);
  radioCompanyBlock.appendChild(companyLabeRadiolElement);
  radioCompanyBlock.appendChild(companyJobRadioElement);
  radioCompanyBlock.appendChild(companyWebsiteRadioElement);
  radioCompanyBlock.appendChild(companyLocationRadioElement);
  radioCompanyBlock.appendChild(companyIndustryRadioElement);
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

function getCompanyLabelRadioElement(company) {
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

function getCompanyJobRadioElement(company) {
  const jobElement = document.createElement("div");
  jobElement.classList.add("company-job");
  jobElement.textContent = company.jobPosition;
  return jobElement;
}

function getCompanyWebsiteRadioElement() {
  const websiteElement = document.createElement("div");
  websiteElement.classList.add("company-website");
  return websiteElement;
}

function getCompanyIndustryRadioElement() {
  const industryElement = document.createElement("div");
  industryElement.classList.add("company-industry");
  return industryElement;
}

function getCompanyLocationRadioElement() {
  const countryElement = document.createElement("div");
  countryElement.classList.add("company-location");
  return countryElement;
}