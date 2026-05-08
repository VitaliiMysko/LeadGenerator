import { subscribe, getState } from "../../store/filter-store.js";
import { initCompanyLocationFilter } from "./company-location.js";
import { initCompanySizeFilter } from "./company-size.js";
import {
  tabExperienceElement,
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

  let noResultsEl = tabExperienceElement.querySelector(".no-results");

  if (visibleCount === 0) {
    if (!noResultsEl) {
      noResultsEl = document.createElement("div");
      noResultsEl.classList.add("no-results");
      noResultsEl.textContent = "No results";
      tabExperienceElement.appendChild(noResultsEl);
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

    const checkedRadio = tabExperienceElement.querySelector("input[type='radio']:checked");
    const checkedIsVisible = checkedRadio && checkedRadio.closest(".radio-company").style.display !== "none";

    if (!checkedIsVisible && firstVisibleCompany) {
      selectCompany(firstVisibleCompany);
    } else if (wasNoResults && checkedIsVisible) {
      selectCompany(checkedRadio.closest(".radio-company"));
    }
  }
}

function selectCompany(companyEl) {
  const radio = companyEl.querySelector("input[type='radio']");
  if (!radio) return;
  radio.checked = true;
  companyNameElement.value = companyEl.dataset.companyName || "";
  jobPositionElement.value = companyEl.dataset.companyJobPosition || "";
  companyCountryElement.value = (companyEl.dataset.companyLocation || "").split(", ").pop();
  companyIndustryElement.value = companyEl.dataset.companyIndustry || "";
  emailElement.value = "";
  radio.dispatchEvent(new Event("change"));
}
