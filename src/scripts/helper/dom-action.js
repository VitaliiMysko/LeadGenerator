import { showAlert } from "../output/alert.js";

export const addCopyByClick = (
  element,
  dataCopySelector,
  getTextOnDemand = () => "",
  alertInfoDetails = ""
) => {
  element.classList.add("copy");

  element.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target.tagName === "IMG" ||
      element.querySelector(`[contenteditable="true"]`)
    ) {
      return;
    }

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
