import { filterOptions, resolveOption } from "../../utils/option-utils.js";

const DROPDOWN_MAX_HEIGHT = 150;

// Turns a text input into a searchable single-select: typing filters the
// dropdown, and on leaving the field its value must be one of `options`
// (or empty) — anything else reverts to the last valid value. The input keeps
// its own `value`, so code that reads or sets it directly keeps working.
export function initSingleSelectInput({ containerId, options }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const input = container.querySelector("input");
  const dropdown = container.querySelector(".dropdown");

  let committed = "";

  input.addEventListener("focus", () => {
    committed = input.value;
    open();
  });

  input.addEventListener("input", (e) => {
    if (!e.isTrusted) return;
    if (!container.classList.contains("open")) open();
    renderDropdown(input.value);
  });

  input.addEventListener("blur", () => {
    const resolved = resolveOption(options, input.value);
    setValue(resolved === null ? committed : resolved);
    close();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = dropdown.querySelector(".option");
      if (first) select(first.textContent);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setValue(committed);
      input.blur();
    }
  });

  function open() {
    container.classList.add("open");
    renderDropdown("");
    placeDropdown();
  }

  function close() {
    container.classList.remove("open");
  }

  function select(option) {
    setValue(option);
    committed = option;
    input.blur();
  }

  function setValue(value) {
    if (input.value === value) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Opens upward when the panel column has no room below the field.
  function placeDropdown() {
    const bounds = (container.closest(".container") || document.body).getBoundingClientRect();
    const rect = container.getBoundingClientRect();
    const spaceBelow = bounds.bottom - rect.bottom;
    const spaceAbove = rect.top - bounds.top;
    container.classList.toggle(
      "drop-up",
      spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow,
    );
  }

  function renderDropdown(filter) {
    dropdown.innerHTML = "";
    filterOptions(options, filter).forEach((option) => {
      const el = document.createElement("div");
      el.className = "option";
      if (option === input.value) el.classList.add("selected");
      el.textContent = option;
      // Keeps focus in the input so blur doesn't fire before the click.
      el.addEventListener("mousedown", (e) => e.preventDefault());
      el.addEventListener("click", () => select(option));
      dropdown.appendChild(el);
    });
    const selected = dropdown.querySelector(".selected");
    dropdown.scrollTop = selected ? selected.offsetTop : 0;
  }
}
