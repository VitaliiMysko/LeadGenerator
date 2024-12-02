import { copyBtnElement, dataContainerElement } from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";

copyBtnElement.addEventListener("click", function () {
  copyToBuffer();
});

function copyToBuffer() {
  const inputs = dataContainerElement.querySelectorAll("input");
  const values = Array.from(inputs)
    .map((input) => input.value)
    .join("\t");

  navigator.clipboard
    .writeText(values)
    .then(() => {
      showAlert("Copy successful!", "success", 3000);
    })
    .catch((err) => {
      showAlert("Copy failed!", "error", 3000);
    });
}
