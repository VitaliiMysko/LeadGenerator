import { subscribe, getState } from "../../store/filter-store.js";
import { initCompanyLocationFilter } from "./company-location.js";
import { initCompanySizeFilter } from "./company-size.js";
import {
  experienceContainerElement,
  jobPositionElement,
  companyNameElement,
  companyCountryElement,
  companyIndustryElement,
  emailElement,
} from "../../helper/dom-helper.js";

export function initFilters() {
  initCompanyLocationFilter();
  initCompanySizeFilter();
  subscribe(applyFilters);
}

export function applyFilters() {
  const { companyLocation, companySize } = getState();

  const companies = document.querySelectorAll(".radio-company");

  let visibleCount = 0;
  let firstVisibleCompany = null;

  companies.forEach((company) => {
    const loc = company.dataset.companyLocation || "";
    const size = company.dataset.companySize || "";

    const matchLocation =
      companyLocation.length === 0 ||
      companyLocation.some((f) => loc.toLowerCase().includes(f.toLowerCase()));

    const matchSize =
      companySize.length === 0 ||
      companySize.some((f) => size.toLowerCase().includes(f.toLowerCase()));

    const visible = matchLocation && matchSize;
    company.style.display = visible ? "block" : "none";
    if (visible) {
      visibleCount++;
      if (!firstVisibleCompany) firstVisibleCompany = company;
    }
  });

  let noResultsEl = experienceContainerElement.querySelector(".no-results");

  if (visibleCount === 0) {
    if (!noResultsEl) {
      noResultsEl = document.createElement("div");
      noResultsEl.classList.add("no-results");
      noResultsEl.textContent = "No results";
      experienceContainerElement.appendChild(noResultsEl);
    }
    noResultsEl.style.display = "block";
    jobPositionElement.value = "";
    companyNameElement.value = "";
    companyCountryElement.value = "";
    companyIndustryElement.value = "";
    emailElement.value = "";
  } else {
    const wasNoResults = noResultsEl && noResultsEl.style.display !== "none";
    if (noResultsEl) noResultsEl.style.display = "none";
    if (wasNoResults && firstVisibleCompany) {
      const radio = firstVisibleCompany.querySelector("input[type='radio']");
      if (radio) radio.checked = true;
      companyNameElement.value = firstVisibleCompany.dataset.companyName || "";
      jobPositionElement.value = firstVisibleCompany.dataset.companyJobPosition || "";
      companyCountryElement.value = (firstVisibleCompany.dataset.companyLocation || "").split(", ").pop();
      companyIndustryElement.value = firstVisibleCompany.dataset.companyIndustry || "";
      emailElement.value = "";
    }
  }
}
