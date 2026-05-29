import {
  getJobPositionElement,
  getCompanyNameElement,
  getCompanyIndustryElement,
  getCompanyCountryElement,
  getEmailElement,
  getTabExperienceElement,
  getOpenCompanyLinkedinBtnElement,
  getGenerateEmailsBtnElement,
} from "../../helper/dom-helper.js";

import { formatCompanySize, refreshCompanyDetails } from "./company-details.js";
import { updateSaveBtnState } from "../data/storage-actions.js";
import { extractCountry } from "../filters/company-location.js";
import { getDefaultCountry } from "../settings/country-by-default.js";

export function createCompanyList(experience) {
  getTabExperienceElement().innerHTML = "";
  getGenerateEmailsBtnElement().disabled = true;

  experience.forEach((company) => {
    const companyBlock = getCompanyBlock(company);
    getTabExperienceElement().appendChild(companyBlock);
  });
}

function getCompanyBlock(company) {
  const extraCompanyData = company.extraData;

  extraCompanyData.companySize = formatCompanySize(
    extraCompanyData.companySize,
  );

  const companyBlock = document.createElement("div");
  companyBlock.classList.add("company-item");
  companyBlock.setAttribute("data-company-name", company.companyName);
  companyBlock.setAttribute("data-company-job-position", company.jobPosition);
  companyBlock.setAttribute("data-company-location", extraCompanyData.location);
  companyBlock.setAttribute("data-company-location-init", extraCompanyData.location);
  companyBlock.setAttribute("data-company-industry", extraCompanyData.industry);
  companyBlock.setAttribute("data-company-industry-init", extraCompanyData.industry);
  companyBlock.setAttribute("data-company-size", extraCompanyData.companySize);
  companyBlock.setAttribute("data-company-size-init", extraCompanyData.companySize);
  companyBlock.setAttribute("data-company-revenue", extraCompanyData.revenue);
  companyBlock.setAttribute("data-company-link", company.companylink || "");

  const header = getCompanyHeaderElement(company);
  const details = getCompanyDetailsElement(company);

  const refreshBtn = header.querySelector(".refresh-btn");
  refreshBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const websiteBlock = companyBlock.querySelector(".company-website");
    if (refreshBtn.classList.contains("loading") || websiteBlock.classList.contains("loading")) return;
    refreshBtn.classList.add("loading");
    websiteBlock.classList.remove("valid");
    websiteBlock.classList.remove("no-valid");
    await refreshCompanyDetails(companyBlock);
    refreshBtn.classList.remove("loading");
  });

  header.addEventListener("click", () => {
    const allItems = getTabExperienceElement().querySelectorAll(".company-item");
    allItems.forEach((item) => item.classList.remove("active"));
    companyBlock.classList.add("active");

    getEmailElement().value = "";
    getCompanyNameElement().value = companyBlock.getAttribute("data-company-name");
    getJobPositionElement().value = companyBlock.getAttribute(
      "data-company-job-position",
    );
    getCompanyCountryElement().value =
      extractCountry(companyBlock.getAttribute("data-company-location")) ||
      getDefaultCountry();
    getCompanyIndustryElement().value = companyBlock.getAttribute(
      "data-company-industry",
    );
    setLinkedinBtn(companyBlock.getAttribute("data-company-link"));
    updateSaveBtnState();
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

  info.appendChild(createCompanyNameElement(company));
  info.appendChild(createCompanyJobElement(company));

  const refreshBtn = document.createElement("div");
  refreshBtn.classList.add("refresh-btn");
  refreshBtn.title = "Refresh company data";
  refreshBtn.textContent = "↻";

  const arrow = document.createElement("div");
  arrow.classList.add("arrow");

  header.appendChild(info);
  header.appendChild(refreshBtn);
  header.appendChild(arrow);
  return header;
}

function createCompanyNameElement(company) {
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

function createCompanyJobElement(company) {
  const jobEl = document.createElement("div");
  jobEl.classList.add("company-job");
  jobEl.textContent = company.jobPosition;
  jobEl.title = "job position";
  return jobEl;
}

function getCompanyDetailsElement(company) {
  const details = document.createElement("div");
  details.classList.add("company-details");

  details.appendChild(createCompanyWebsiteElement());
  details.appendChild(createCompanyIndustryElement(company));
  details.appendChild(createCompanyLocationElement(company));
  details.appendChild(createCompanySizeRowElement(company));
  return details;
}

function createCompanyWebsiteElement() {
  const websiteEl = document.createElement("div");
  websiteEl.classList.add("company-website");
  websiteEl.title = "website";
  return websiteEl;
}

function createCompanyLocationElement(company) {
  const locationEl = document.createElement("div");
  locationEl.classList.add("company-location");
  locationEl.textContent = company.extraData.location;
  locationEl.title = "location";
  return locationEl;
}

function createCompanyIndustryElement(company) {
  const industryEl = document.createElement("div");
  industryEl.classList.add("company-industry");
  industryEl.textContent = company.extraData.industry;
  industryEl.title = "industry";
  return industryEl;
}

function createCompanySizeRowElement(company) {
  const rowEl = document.createElement("div");
  rowEl.classList.add("company-size-row");
  rowEl.appendChild(createCompanySizeElement(company));
  rowEl.appendChild(createCompanyMembersElement());
  return rowEl;
}

function createCompanySizeElement(company) {
  const sizeEl = document.createElement("div");
  sizeEl.classList.add("company-size");
  sizeEl.textContent = company.extraData.companySize;
  sizeEl.title = "size";
  return sizeEl;
}

function createCompanyMembersElement() {
  const membersEl = document.createElement("div");
  membersEl.classList.add("company-members");
  membersEl.title = "members";
  return membersEl;
}

function setLinkedinBtn(link) {
  getOpenCompanyLinkedinBtnElement().disabled = !link;
  getOpenCompanyLinkedinBtnElement().dataset.href = link || "";
}
