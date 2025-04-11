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

    dataElement.classList.add("copy-effect");

    setTimeout(() => {
      dataElement.classList.remove("copy-effect");
    }, 1000);

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

export const useUpdateEffect = (element) => {
  element.classList.add("update-effect");

  setTimeout(() => {
    element.classList.remove("update-effect");
  }, 1000);
};
