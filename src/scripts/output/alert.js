import { getAlertElement } from "../helper/dom-helper.js";

export function showAlert(message, type = "success", duration = 2000) {
  const alertElement = getAlertElement();
  alertElement.textContent = message.trim();
  alertElement.classList.add("show", type);
  setTimeout(() => {
    alertElement.classList.remove("show", type);
  }, duration);
}
