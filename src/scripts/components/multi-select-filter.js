import { setFilter, getState, subscribe } from "../store/filter-store.js";

export function initMultiSelectFilter({ containerId, options, filterKey }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const dropdown = container.querySelector(".dropdown");
  const input = container.querySelector(".multi-input");
  const tagsContainer = container.querySelector(".tags-container");

  let selected = new Set();

  container.addEventListener("click", () => {
    container.classList.add("open");
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove("open");
    }
  });

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
        setFilter(filterKey, [...selected].filter((v) => v !== value));
      });

      tagsContainer.appendChild(tag);
    });
  }

  function renderDropdown(filter = "") {
    dropdown.innerHTML = "";

    options
      .filter((opt) => opt.toLowerCase().includes(filter.toLowerCase()))
      .filter((opt) => !selected.has(opt))
      .forEach((option) => {
        const el = document.createElement("div");
        el.className = "option";
        el.textContent = option;

        el.addEventListener("click", () => {
          setFilter(filterKey, [...selected, option]);
        });

        dropdown.appendChild(el);
      });
  }

  function render() {
    selected = new Set(getState()[filterKey]);
    renderTags();
    renderDropdown();
  }

  subscribe(render);
  render();
}
