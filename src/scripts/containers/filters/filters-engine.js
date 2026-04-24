import { subscribe, getState } from "../../store/filter-store.js";
import { initCompanyLocationFilter } from "./company-location.js";
import { initCompanySizeFilter } from "./company-size.js";

export function initFilters() {
  initCompanyLocationFilter();
  initCompanySizeFilter();
  subscribe(applyFilters);
}

export function applyFilters() {
  const { companyLocation, companySize } = getState();

  const companies = document.querySelectorAll(".radio-company");

  companies.forEach((company) => {
    const loc = company.dataset.companyLocation || "";
    const size = company.dataset.companySize || "";

    const matchLocation =
      companyLocation.length === 0 ||
      companyLocation.some((f) => loc.toLowerCase().includes(f.toLowerCase()));

    const matchSize =
      companySize.length === 0 ||
      companySize.some((f) => size.toLowerCase().includes(f.toLowerCase()));

    company.style.display = matchLocation && matchSize ? "block" : "none";
  });
}
