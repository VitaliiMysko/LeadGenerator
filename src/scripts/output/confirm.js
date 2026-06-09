import { getConfirmDialogElement } from "../helper/dom-helper.js";

export function showConfirm(message) {
  return new Promise((resolve) => {
    const dialog = getConfirmDialogElement();
    dialog.querySelector("#confirm-message").textContent = message;
    dialog.style.display = "flex";

    function cleanup(result) {
      dialog.style.display = "none";
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      resolve(result);
    }

    const okBtn = dialog.querySelector("#confirm-ok");
    const cancelBtn = dialog.querySelector("#confirm-cancel");

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
}
