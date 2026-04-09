import { getFromStorage, setToStorage } from "./common.js";
import { transliterateElement } from "../../services/transliteration.js";
import { showAlert } from "../../output/alert.js";
import {
  getFirstNameElement,
  getSecondNameElement,
} from "../../helper/dom-helper.js";

export async function initTransliteration() {
  const settingsElement = document.getElementById("transliteration-settings");
  if (settingsElement == null) return;

  try {
    const transliterationEnabled = !!(await getFromStorage(
      "transliterationEnabled",
    ));
    settingsElement.checked = transliterationEnabled;
  } catch (error) {
    console.error(error);
  }

  settingsElement.addEventListener("change", async (e) => {
    const enabled = e.target.checked;
    try {
      await setToStorage("transliterationEnabled", enabled);

      await transliterateElement(getFirstNameElement());
      await transliterateElement(getSecondNameElement());

      showAlert("Done", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed", "error");
    }
  });
}
