import { showAlert } from "../output/alert.js";

export const addCopyByClick = (
  element,
  dataCopySelector,
  getTextOnDemand = () => "",
  alertInfoDetails = ""
) => {
  element.classList.add("copy");

  element.addEventListener("click", () => {
    const dataElement = element.querySelector(dataCopySelector);

    useTextChangeEffect(dataElement);

    let dataCopy = getTextOnDemand();

    if (dataCopy === "" && dataElement) {
      dataCopy = dataElement.textContent;
    }

    if (dataCopy !== "") {
      navigator.clipboard
        .writeText(dataCopy)
        .then(() => {
          showAlert(`Copy ${alertInfoDetails}`, "success");
        })
        .catch((err) => {
          showAlert(`Copy ${alertInfoDetails} failed!`, "error");
        });
    }
  });
};

export const setValidationStyle = (element, value) => {
  if (value) {
    element.classList.add("valid");
  } else {
    element.classList.add("no-valid");
  }
};

export const useTextChangeEffect = (element) => {
  element.classList.add("text-change-effect");

  setTimeout(() => {
    element.classList.remove("text-change-effect");
  }, 1000);
};

export function editText(element, { onSave } = {}) {
  if (!(element instanceof HTMLElement)) return;

  const previousValueKey = "data-previous-value";
  const isEditingKey = "data-is-editing";

  const startEditing = () => {
    if (element.getAttribute(isEditingKey) === "true") return;
    element.setAttribute(previousValueKey, element.textContent.trim());
    element.contentEditable = true;
    element.setAttribute(isEditingKey, "true");
    element.focus();
  };

  const finishEditing = () => {
    if (element.getAttribute(isEditingKey) !== "true") return;
    element.contentEditable = false;
    element.removeAttribute(isEditingKey);

    const previousValue = element.getAttribute(previousValueKey);
    let newValue = element.textContent.trim();

    // Handling an empty value - return the previous value
    if (!newValue) {
      element.textContent = previousValue;
      return;
    }

    if (newValue !== previousValue && typeof onSave === "function") {
      onSave(newValue);
    }
  };

  const onBlur = () => {
    finishEditing();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      element.blur();
    }
  };

  const onDoubleClick = () => {
    startEditing();
  };

  element.addEventListener("blur", onBlur);
  element.addEventListener("keydown", onKeyDown);
  element.addEventListener("dblclick", onDoubleClick);
}
