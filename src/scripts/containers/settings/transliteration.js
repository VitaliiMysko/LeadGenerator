import { getFromStorage, setToStorage } from "./common.js";
import { showAlert } from "../../output/alert.js";

document.addEventListener("DOMContentLoaded", async () => {
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
      showAlert("Done", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed", "error");
    }
  });
});
