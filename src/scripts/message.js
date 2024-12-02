import { messageElement } from "./dom-manager.js";

export function showMessage(message, type = "success", duration = 3000) {
  messageElement.textContent = message;
  messageElement.classList.add("show", type);
  setTimeout(() => {
    messageElement.classList.remove("show", type);
  }, duration);
}
