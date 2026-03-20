import {
  getTabSelectorTriggerElement,
  getTabDropdownElement,
  getTabOptionElements,
  getTabElements,
} from "../../helper/dom-helper.js";

const trigger = getTabSelectorTriggerElement();
const dropdown = getTabDropdownElement();
const options = getTabOptionElements();

trigger.addEventListener("click", () => {
  if (dropdown.style.display === "block") {
    removeHandleDocumentClick();
  } else {
    trigger.classList.add("open");
    dropdown.style.display = "block";
    document.addEventListener("click", handleDocumentClick);
  }
});

const handleDocumentClick = (e) => {
  if (!trigger.contains(e.target)) {
    removeHandleDocumentClick();
  }
};

const removeHandleDocumentClick = () => {
  trigger.classList.remove("open");
  dropdown.style.display = "none";
  document.removeEventListener("click", handleDocumentClick);
};

options.forEach((option) => {
  option.addEventListener("click", (element) => {
    getTabOptionElements().forEach((label) => label.classList.remove("active"));
    getTabElements().forEach((label) => label.classList.remove("active"));
    element.target.classList.add("active");

    const selectedTabBlock = document.getElementById("selected-tab");
    selectedTabBlock.textContent = "";

    const viewElement = document.createElement("h3");
    viewElement.textContent = option.textContent;

    selectedTabBlock.appendChild(viewElement);

    dropdown.style.display = "none";

    const selectedTabName = element.target.getAttribute("data-tab");
    const selectedTabElement = document.getElementById(
      `tab-${selectedTabName}`,
    );
    selectedTabElement.classList.add("active");
  });
});
