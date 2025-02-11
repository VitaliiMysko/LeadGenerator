import {
  copyBtnElement,
  emailElement,
  dataContainerElement,
} from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";

copyBtnElement.addEventListener("click", () => {
  copyToBuffer();
});

function copyToBuffer() {
  emailElement.value = emailElement.value.toLocaleLowerCase();

  const inputs = dataContainerElement.querySelectorAll("input");
  const values = Array.from(inputs)
    .map((input) => input.value)
    .join("\t");

  navigator.clipboard
    .writeText(values)
    .then(() => {
      showAlert("Copy successful!", "success");
    })
    .catch((err) => {
      showAlert("Copy failed!", "error");
    });
}
