import { setFilter, getState, subscribe } from "../../store/filter-store.js";

let selected = new Set();
let allOptions = [
  "USA",
  "Germany",
  "Ukraine",
  "Poland",
  "United Kingdom",
  "France",
  "Switzerland",
];

export function initCompanyLocationFilter() {
  const container = document.getElementById("company-location-filter");
  if (!container) return;

  const dropdown = container.querySelector(".dropdown");
  const input = container.querySelector(".multi-input");
  const tagsContainer = container.querySelector(".tags-container");

  // open
  container.addEventListener("click", () => {
    container.classList.add("open");
  });

  // close outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove("open");
    }
  });

  // search
  input.addEventListener("input", (e) => {
    renderDropdown(e.target.value);
  });

  function renderTags() {
    tagsContainer.innerHTML = "";

    selected.forEach((value) => {
      const tag = document.createElement("div");
      tag.className = "tag";

      tag.innerHTML = `${value} <span class="tag-remove">×</span>`;

      tag.querySelector(".tag-remove").addEventListener("click", () => {
        setFilter(
          "companyLocation",
          [...selected].filter((v) => v !== value),
        );
      });

      tagsContainer.appendChild(tag);
    });
  }

  function renderDropdown(filter = "") {
    dropdown.innerHTML = "";

    allOptions
      .filter((opt) => opt.toLowerCase().includes(filter.toLowerCase()))
      .filter((opt) => !selected.has(opt))
      .forEach((option) => {
        const el = document.createElement("div");
        el.className = "option";
        el.textContent = option;

        el.addEventListener("click", () => {
          setFilter("companyLocation", [...selected, option]);
        });

        dropdown.appendChild(el);
      });
  }

  function render() {
    selected = new Set(getState().companyLocation);
    renderTags();
    renderDropdown();
  }

  input.addEventListener("input", (e) => {
    const filter = e.target.value.toLowerCase();
    renderDropdown(filter);
  });

  subscribe(render);

  render();
}
