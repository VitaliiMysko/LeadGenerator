import { EUROPEAN_COUNTRIES } from "../../../constants/countries.js";
import { initMultiSelectFilter } from "../../components/multi-select-filter.js";

export const allOptions = EUROPEAN_COUNTRIES;

export function extractCountry(location) {
  if (!location) return "";
  const lastPart = location.split(", ").pop();
  if (allOptions.includes(lastPart)) return lastPart;
  return allOptions.find((country) => location.includes(country)) || "";
}

export function initCompanyLocationFilter() {
  initMultiSelectFilter({
    containerId: "company-location-filter",
    options: EUROPEAN_COUNTRIES,
    filterKey: "companyLocation",
  });
}
