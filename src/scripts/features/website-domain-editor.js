import { useTextChangeEffect } from "../helper/dom-action.js";

export function getEditWebsiteDomainElement() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("edit-website-domain-wrapper");

  const icon = document.createElement("img");
  icon.classList.add("edit-website-domain-icon");
  icon.src = "assets/icons/edit-website-domain-16.png";
  icon.alt = "Edit website domain";
  icon.title = "Edit website domain";

  wrapper.appendChild(icon);
  wrapper._icon = icon;

  return wrapper;
}

export function editWebsiteDomain(element, controlEditElement, { onSave, placeholderValue } = {}) {
  if (!(element instanceof HTMLElement)) return;

  const iconElement = controlEditElement._icon;
  const PREVIOUS_VALUE_KEY = "data-previous-value";
  const IS_EDITING_KEY = "data-is-editing";

  const ICON = {
    src: "assets/icons/edit-website-domain-16.png",
    alt: "Edit website domain",
    title: "Edit website domain",
  };

  const isEditing = () => element.getAttribute(IS_EDITING_KEY) === "true";

  const updateIcon = () => {
    iconElement.src = ICON.src;
    iconElement.alt = ICON.alt;
    iconElement.title = ICON.title;
  };

  const startEditing = () => {
    if (isEditing()) return;
    const currentValue = element.textContent.trim();
    element.setAttribute(PREVIOUS_VALUE_KEY, currentValue);
    element.setAttribute(IS_EDITING_KEY, "true");
    element.setAttribute("spellcheck", "false");
    element.contentEditable = "true";
    element.classList.add("editing-domain");
    if (placeholderValue && currentValue === placeholderValue) {
      element.textContent = "";
    }
    element.focus();
    controlEditElement.style.display = "none";
    document.addEventListener("click", handleDocumentClick);
  };

  const stopEditing = (shouldSave = true) => {
    if (!isEditing()) return;

    const previousValue = element.getAttribute(PREVIOUS_VALUE_KEY);
    const newValue = element.textContent.trim();

    element.contentEditable = "false";
    element.classList.remove("editing-domain");
    element.removeAttribute(IS_EDITING_KEY);
    updateIcon();
    element.title = newValue;
    controlEditElement.style.display = "inline-flex";

    if (shouldSave) {
      if (!newValue) {
        element.textContent = previousValue;
        element.title = previousValue;
        return;
      }
      if (newValue !== previousValue && typeof onSave === "function") {
        onSave(newValue);
      }
    } else {
      element.textContent = previousValue;
      element.title = previousValue;
    }

    useTextChangeEffect(element);
    document.removeEventListener("click", handleDocumentClick);
  };

  const finishEditing = () => stopEditing(true);
  const cancelEditing = () => stopEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleDocumentClick = (e) => {
    if (
      isEditing() &&
      !element.contains(e.target) &&
      !controlEditElement.contains(e.target)
    ) {
      finishEditing();
    }
  };

  controlEditElement.addEventListener("click", () => {
    if (!isEditing()) startEditing();
  });
  element.addEventListener("keydown", handleKeyDown);
  element.addEventListener("paste", handlePaste);
}
