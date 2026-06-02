import { COMPANY_SIZES } from "../../../constants/company-sizes.js";
import { initMultiSelectFilter } from "../../components/multi-select-filter.js";

export function initCompanySizeFilter() {
  initMultiSelectFilter({
    containerId: "company-size-filter",
    options: COMPANY_SIZES,
    filterKey: "companySize",
  });
}
