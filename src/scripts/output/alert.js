import { alertElement } from "../helper/dom-helper.js";

export function showAlert(message, type = "success", duration = 5000) {
  alertElement.textContent = message.trim();
  alertElement.classList.add("show", type);
  setTimeout(() => {
    alertElement.classList.remove("show", type);
  }, duration);
}
