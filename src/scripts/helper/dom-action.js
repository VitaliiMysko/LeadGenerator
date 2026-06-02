import { showAlert } from "../output/alert.js";

export const addCopyOnClickListener = (
  element,
  dataCopySelector,
  getTextOnDemand = () => "",
  alertInfoDetails = ""
) => {
  element.classList.add("copy");

  element.addEventListener("click", async (event) => {
    const target = event.target;
    if (
      target.tagName === "IMG" ||
      element.querySelector(`[contenteditable="true"]`)
    ) {
      return;
    }

    const dataElement = element.querySelector(dataCopySelector);

    if (dataElement) useTextChangeEffect(dataElement);

    let dataCopy = getTextOnDemand();

    if (dataCopy === "" && dataElement) {
      dataCopy = dataElement.textContent;
    }

    if (dataCopy !== "") {
      try {
        await navigator.clipboard.writeText(dataCopy);
        showAlert(`Copy ${alertInfoDetails}`, "success");
      } catch {
        showAlert(`Copy ${alertInfoDetails} failed!`, "error");
      }
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

export const useTextChangeEffect = (element, duration = 1000) => {
  element.classList.add("text-change-effect");

  setTimeout(() => {
    element.classList.remove("text-change-effect");
  }, duration);
};

export const useValidationEffect = (element, isValid, duration = 2000) => {
  element.classList.remove("validation-success", "validation-error");

  if (isValid) {
    element.classList.add("validation-success");
  } else {
    element.classList.add("validation-error");
  }

  setTimeout(() => {
    element.classList.remove("validation-success", "validation-error");
  }, duration);
};
