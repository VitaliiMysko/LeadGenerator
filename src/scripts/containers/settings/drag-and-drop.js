import {
  enableDragAndDrop,
  disableDragAndDrop,
} from "../../feature/drag-and-drop.js";
import { getFromStorage, setToStorage } from "./common.js";
import { showAlert } from "../../output/alert.js";

export async function initDragAndDrop() {
  const settingsElement = document.getElementById("drag-and-drop-settings");
  if (settingsElement == null) return;

  try {
    const dragAndDropEnabled = !!(await getFromStorage("dragAndDropEnabled"));
    settingsElement.checked = dragAndDropEnabled;
    if (dragAndDropEnabled) {
      enableDragAndDrop();
    } else {
      disableDragAndDrop();
    }
  } catch (error) {
    console.error(error);
  }

  settingsElement.addEventListener("change", async (e) => {
    const enabled = e.target.checked;
    try {
      await setToStorage("dragAndDropEnabled", enabled);
      if (enabled) {
        enableDragAndDrop();
      } else {
        disableDragAndDrop();
      }
      showAlert("Done", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed", "error");
    }
  });
}
