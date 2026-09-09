import { COUNTRIES } from "../../../constants/countries.js";
import { initMultiSelectFilter } from "../../components/multi-select-filter.js";

export const allOptions = COUNTRIES;

export function extractCountry(location) {
  if (!location) return "";
  const lastPart = location.split(", ").pop();
  if (allOptions.includes(lastPart)) return lastPart;
  return allOptions.find((country) => location.includes(country)) || "";
}

export function initCompanyLocationFilter() {
  initMultiSelectFilter({
    containerId: "company-location-filter",
    options: COUNTRIES,
    filterKey: "companyLocation",
  });
}
