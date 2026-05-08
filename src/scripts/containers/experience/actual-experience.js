import {
  jobPositionElement,
  companyNameElement,
  companyIndustryElement,
  companyCountryElement,
  emailElement,
  tabExperienceElement,
} from "../../helper/dom-helper.js";

import { formatCompanySize } from "./company-details.js";

export function createCompanyList(experience) {
  tabExperienceElement.innerHTML = "";

  experience.forEach((company, index) => {
    const companyBlock = getCompanyBlock(company, index);
    tabExperienceElement.appendChild(companyBlock);
  });
}

function getCompanyBlock(company, index) {
  const extraCompanyData = company.extraData;

  extraCompanyData.companySize = formatCompanySize(extraCompanyData.companySize);

  const companyBlock = document.createElement("div");
  companyBlock.classList.add("company-item");
  companyBlock.setAttribute("data-company-name", company.companyName);
  companyBlock.setAttribute("data-company-job-position", company.jobPosition);
  companyBlock.setAttribute("data-company-location", extraCompanyData.location);
  companyBlock.setAttribute("data-company-industry", extraCompanyData.industry);
  companyBlock.setAttribute("data-company-size", extraCompanyData.companySize);
  companyBlock.setAttribute("data-company-revenue", extraCompanyData.revenue);

  const header = getCompanyHeaderElement(company);
  const details = getCompanyDetailsElement(company);

  if (index === 0) {
    companyBlock.classList.add("active");
    companyNameElement.value = company.companyName;
    jobPositionElement.value = company.jobPosition;
    emailElement.value = "";
    companyIndustryElement.value = extraCompanyData.industry;
    companyCountryElement.value = extraCompanyData.location.split(", ").pop();
  }

  header.addEventListener("click", () => {
    const allItems = tabExperienceElement.querySelectorAll(".company-item");
    allItems.forEach((item) => item.classList.remove("active"));
    companyBlock.classList.add("active");

    emailElement.value = "";
    companyNameElement.value = companyBlock.getAttribute("data-company-name");
    jobPositionElement.value = companyBlock.getAttribute("data-company-job-position");
    companyCountryElement.value = companyBlock
      .getAttribute("data-company-location")
      .split(", ")
      .pop();
    companyIndustryElement.value = companyBlock.getAttribute("data-company-industry");
  });

  companyBlock.appendChild(header);
  companyBlock.appendChild(details);
  return companyBlock;
}

function getCompanyHeaderElement(company) {
  const header = document.createElement("div");
  header.classList.add("company-header");

  const info = document.createElement("div");
  info.classList.add("company-header-info");

  info.appendChild(getCompanyNameElement(company));
  info.appendChild(getCompanyJobElement(company));

  const arrow = document.createElement("div");
  arrow.classList.add("arrow");

  header.appendChild(info);
  header.appendChild(arrow);
  return header;
}

function getCompanyNameElement(company) {
  const nameEl = document.createElement("div");
  nameEl.classList.add("company-name");

  if (company.companylink !== "") {
    const link = document.createElement("a");
    link.href = company.companylink;
    link.textContent = company.companyName;
    nameEl.appendChild(link);
  } else {
    nameEl.textContent = company.companyName;
  }
  return nameEl;
}

function getCompanyJobElement(company) {
  const jobEl = document.createElement("div");
  jobEl.classList.add("company-job");
  jobEl.textContent = company.jobPosition;
  jobEl.title = "job position";
  return jobEl;
}

function getCompanyDetailsElement(company) {
  const details = document.createElement("div");
  details.classList.add("company-details");

  details.appendChild(getCompanyWebsiteElement());
  details.appendChild(getCompanyLocationElement(company));
  details.appendChild(getCompanyIndustryElement(company));
  details.appendChild(getCompanySizeElement(company));

  return details;
}

function getCompanyWebsiteElement() {
  const websiteEl = document.createElement("div");
  websiteEl.classList.add("company-website");
  websiteEl.title = "website";
  return websiteEl;
}

function getCompanyLocationElement(company) {
  const locationEl = document.createElement("div");
  locationEl.classList.add("company-location");
  locationEl.textContent = company.extraData.location;
  locationEl.title = "location";
  return locationEl;
}

function getCompanyIndustryElement(company) {
  const industryEl = document.createElement("div");
  industryEl.classList.add("company-industry");
  industryEl.textContent = company.extraData.industry;
  industryEl.title = "industry";
  return industryEl;
}

function getCompanySizeElement(company) {
  const sizeEl = document.createElement("div");
  sizeEl.classList.add("company-size");
  sizeEl.textContent = company.extraData.companySize;
  sizeEl.title = "size";
  return sizeEl;
}
