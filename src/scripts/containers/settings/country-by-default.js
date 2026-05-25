import { getFromStorage, setToStorage } from "./common.js";
import { allOptions } from "../filters/company-location.js";

let enabled = false;
let country = "";

export function getDefaultCountry() {
  return enabled ? country : "";
}

export async function initCountryByDefault() {
  const toggleEl = document.getElementById("country-by-default-settings");
  const wrapperEl = document.getElementById("country-by-default-wrapper");
  const selectEl = document.getElementById("country-by-default-select");
  const inputEl = selectEl.querySelector(".single-input");
  const dropdownEl = selectEl.querySelector(".dropdown");

  enabled = !!(await getFromStorage("countryByDefaultEnabled"));
  country = (await getFromStorage("countryByDefault")) || "";

  toggleEl.checked = enabled;
  inputEl.value = country;
  wrapperEl.style.display = enabled ? "" : "none";

  toggleEl.addEventListener("change", async (e) => {
    enabled = e.target.checked;
    await setToStorage("countryByDefaultEnabled", enabled);
    wrapperEl.style.display = enabled ? "" : "none";
    if (!enabled) {
      country = "";
      inputEl.value = "";
      await setToStorage("countryByDefault", "");
    }
  });

  selectEl.addEventListener("click", () => {
    selectEl.classList.add("open");
    renderDropdown(inputEl.value);
  });

  document.addEventListener("click", (e) => {
    if (!selectEl.contains(e.target)) {
      selectEl.classList.remove("open");
      inputEl.value = country;
    }
  });

  inputEl.addEventListener("input", () => {
    renderDropdown(inputEl.value);
  });

  function renderDropdown(filter = "") {
    dropdownEl.innerHTML = "";
    allOptions
      .filter((opt) => opt.toLowerCase().includes(filter.toLowerCase()))
      .forEach((opt) => {
        const el = document.createElement("div");
        el.className = "option";
        if (opt === country) el.classList.add("selected");
        el.textContent = opt;
        el.addEventListener("click", async (e) => {
          e.stopPropagation();
          country = opt;
          inputEl.value = opt;
          selectEl.classList.remove("open");
          await setToStorage("countryByDefault", opt);
        });
        dropdownEl.appendChild(el);
      });
  }
}
