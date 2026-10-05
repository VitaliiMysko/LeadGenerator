import { COUNTRIES } from "../../../constants/countries.js";
import { initSingleSelectInput } from "../../components/single-select-input.js";

export function initCompanyCountryField() {
  initSingleSelectInput({
    containerId: "company-country-select",
    options: COUNTRIES,
  });
}
