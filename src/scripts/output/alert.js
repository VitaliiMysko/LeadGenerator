import { alertElement } from "../helper/dom-helper.js";

export function showAlert(message, type = "success", duration = 3000) {
  alertElement.textContent = message;
  alertElement.classList.add("show", type);
  setTimeout(() => {
    alertElement.classList.remove("show", type);
  }, duration);
}
