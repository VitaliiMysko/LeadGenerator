import { copyBtnElement, dataContainerElement } from "./dom-manager.js";
import { showMessage } from "./message.js";

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
      showMessage("Copy successful!", "success", 3000);
    })
    .catch((err) => {
      showMessage("Copy failed!", "error", 3000);
    });
}
