import {
  getTabSelectorTriggerElement,
  getTabDropdownElement,
  getTabOptionElements,
  getTabElements,
} from "../../helper/dom-helper.js";

const trigger = getTabSelectorTriggerElement();
const dropdown = getTabDropdownElement();
const options = getTabOptionElements();
const tabsContainer = trigger.closest(".tabs-container");

const isDropdownOpen = () => dropdown.style.display === "block";

const openDropdown = () => {
  trigger.classList.add("open");
  tabsContainer.classList.add("tab-dropdown-open");
  dropdown.style.display = "block";
  document.addEventListener("click", handleDocumentClick);
};

const closeDropdown = () => {
  trigger.classList.remove("open");
  tabsContainer.classList.remove("tab-dropdown-open");
  dropdown.style.display = "none";
  document.removeEventListener("click", handleDocumentClick);
};

const handleDocumentClick = (e) => {
  if (!trigger.contains(e.target)) {
    closeDropdown();
  }
};

trigger.addEventListener("click", () => {
  if (isDropdownOpen()) {
    closeDropdown();
  } else {
    openDropdown();
  }
});

options.forEach((option) => {
  option.addEventListener("click", (event) => {
    getTabOptionElements().forEach((opt) => opt.classList.remove("active"));
    getTabElements().forEach((tab) => tab.classList.remove("active"));
    event.target.classList.add("active");

    const selectedTabBlock = document.getElementById("selected-tab");
    selectedTabBlock.textContent = "";

    const viewElement = document.createElement("h3");
    viewElement.textContent = option.textContent;

    selectedTabBlock.appendChild(viewElement);

    closeDropdown();

    const selectedTabName = event.target.getAttribute("data-tab");
    const selectedTabElement = document.getElementById(
      `tab-${selectedTabName}`,
    );
    selectedTabElement.classList.add("active");
  });
});
