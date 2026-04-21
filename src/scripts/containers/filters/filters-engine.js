import { subscribe, getState } from "../../store/filter-store.js";
import { initCompanyLocationFilter } from "./company-location.js";

export function initFilters() {
  initCompanyLocationFilter();
  subscribe(applyFilters);
}

export function applyFilters() {
  const { companyLocation } = getState();

  const companies = document.querySelectorAll(".radio-company");

  companies.forEach((company) => {
    const loc = company.dataset.companyLocation || "";

    const matchLocation =
      companyLocation.length === 0 ||
      companyLocation.some((f) => loc.toLowerCase().includes(f.toLowerCase()));

    company.style.display = matchLocation ? "block" : "none";
  });
}
