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
  const extraCompanyData = company.extraData;
  const radioCompanyBlock = document.createElement("div");
  radioCompanyBlock.classList.add("radio-company");
  radioCompanyBlock.setAttribute(`data-company-name`, company.companyName);
  radioCompanyBlock.setAttribute(
    `data-company-job-position`,
    company.jobPosition
  );
  radioCompanyBlock.setAttribute(
    `data-company-location`,
    extraCompanyData.location
  );
  radioCompanyBlock.setAttribute(
    `data-company-industry`,
    extraCompanyData.industry
  );
  radioCompanyBlock.setAttribute(
    `data-company-size`,
    extraCompanyData.companySize
  );
    radioCompanyBlock.setAttribute(
    `data-company-revenue`,
    extraCompanyData.revenue
  );

  const radioItem = getCompanyRadioElement(company);
  const companyLabeRadiolElement = getCompanyLabelRadioElement(company);
  const companyJobRadioElement = getCompanyJobRadioElement(company);
  const companyWebsiteRadioElement = getCompanyWebsiteRadioElement();
  const companyLocationRadioElement = getCompanyLocationRadioElement(company);
  const companyIndustryRadioElement = getCompanyIndustryRadioElement(company);
  const companySizeRadioElement = getCompanySizeRadioElement(company);

  if (index === 0) {
    radioItem.checked = true;
    companyNameElement.value = company.companyName;
    jobPositionElement.value = company.jobPosition;
    emailElement.value = "";
    companyIndustryElement.value = extraCompanyData.industry;
    companyCountryElement.value = extraCompanyData.location.split(", ").pop();
  }

  radioItem.addEventListener("change", () => {
    if (radioItem.checked) {
      const parentDiv = radioItem.closest(".radio-company");
      emailElement.value = "";
      companyNameElement.value = parentDiv.getAttribute("data-company-name");
      jobPositionElement.value = parentDiv.getAttribute(
        "data-company-job-position"
      );
      companyCountryElement.value = parentDiv
        .getAttribute("data-company-location")
        .split(", ")
        .pop();
      companyIndustryElement.value = parentDiv.getAttribute(
        "data-company-industry"
      );
    }
  });

  radioCompanyBlock.appendChild(radioItem);
  radioCompanyBlock.appendChild(companyLabeRadiolElement);
  radioCompanyBlock.appendChild(companyJobRadioElement);
  radioCompanyBlock.appendChild(companyWebsiteRadioElement);
  radioCompanyBlock.appendChild(companyLocationRadioElement);
  radioCompanyBlock.appendChild(companyIndustryRadioElement);
  radioCompanyBlock.appendChild(companySizeRadioElement);
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

function getCompanyLocationRadioElement(company) {
  const countryElement = document.createElement("div");
  countryElement.classList.add("company-location");
  countryElement.textContent = company.extraData.location;
  return countryElement;
}

function getCompanyIndustryRadioElement(company) {
  const industryElement = document.createElement("div");
  industryElement.classList.add("company-industry");
  industryElement.textContent = company.extraData.industry;
  return industryElement;
}

function getCompanySizeRadioElement(company) {
  const sizeElement = document.createElement("div");
  sizeElement.classList.add("company-size");
  sizeElement.textContent = company.extraData.companySize;
  return sizeElement;
}
