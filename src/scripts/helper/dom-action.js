import { showAlert } from "../output/alert.js";

export const addCopyByClick = (element, dataCopySelector) => {
  element.classList.add("copy");

  element.addEventListener("click", () => {
    const dataElement = element.querySelector(dataCopySelector);
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
