import { showAlert } from "../output/alert.js";

export const addCopyByClick = (element, dataCopySelector) => {
  element.classList.add("copy");

  element.addEventListener("click", () => {
    const dataElement = element.querySelector(dataCopySelector);

    dataElement.classList.add("copy-effect");

    setTimeout(() => {
      dataElement.classList.remove("copy-effect");
    }, 1000);

    if (dataElement) {
      navigator.clipboard
        .writeText(dataElement.textContent)
        .then(() => {
          showAlert("Copy", "success");
        })
        .catch((err) => {
          showAlert("Copy failed!", "error");
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
