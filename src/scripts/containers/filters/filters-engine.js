import { subscribe, getState } from "../../store/filter-store.js";
import { initCompanyLocationFilter } from "./company-location.js";
import { initCompanySizeFilter } from "./company-size.js";
import {
  getTabExperienceElement,
  getJobPositionElement,
  getCompanyNameElement,
  getCompanyCountryElement,
  getCompanyIndustryElement,
  getEmailElement,
  getGenerateEmailsBtnElement,
} from "../../helper/dom-helper.js";

export function initFilters() {
  initCompanyLocationFilter();
  initCompanySizeFilter();
  subscribe(applyFilters);
}

export function applyFilters() {
  const { companyLocation, companySize } = getState();

  const companies = document.querySelectorAll(".company-item");

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

  let noResultsEl = getTabExperienceElement().querySelector(".no-results");

  if (visibleCount === 0) {
    if (!noResultsEl) {
      noResultsEl = document.createElement("div");
      noResultsEl.classList.add("no-results");
      noResultsEl.textContent = "No results";
      getTabExperienceElement().appendChild(noResultsEl);
    }
    noResultsEl.style.display = "block";
    getJobPositionElement().value = "";
    getCompanyNameElement().value = "";
    getCompanyCountryElement().value = "";
    getCompanyIndustryElement().value = "";
    getEmailElement().value = "";
    getGenerateEmailsBtnElement().disabled = true;
  } else {
    const wasNoResults = noResultsEl && noResultsEl.style.display !== "none";
    if (noResultsEl) noResultsEl.style.display = "none";

    const activeItem = getTabExperienceElement().querySelector(
      ".company-item.active",
    );
    const activeIsVisible = activeItem && activeItem.style.display !== "none";

    if (!activeIsVisible && firstVisibleCompany) {
      selectCompany(firstVisibleCompany);
    } else if (wasNoResults && activeIsVisible) {
      selectCompany(activeItem);
    }
  }
}

function selectCompany(companyEl) {
  getEmailElement().value = "";
  const header = companyEl.querySelector(".company-header");
  if (header) header.click();
}
