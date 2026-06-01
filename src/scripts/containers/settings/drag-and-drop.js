import {
  enableDragAndDrop,
  disableDragAndDrop,
} from "../../features/drag-and-drop.js";
import { syncGet, syncSet } from "../../utils/chrome-storage.js";
import { showAlert } from "../../output/alert.js";

export async function initDragAndDrop() {
  const settingsElement = document.getElementById("drag-and-drop-settings");
  if (settingsElement == null) return;

  try {
    const dragAndDropEnabled = !!(await syncGet("dragAndDropEnabled"));
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
      await syncSet("dragAndDropEnabled", enabled);
      if (enabled) {
        enableDragAndDrop();
      } else {
        disableDragAndDrop();
      }
      showAlert("Done", "success");
    } catch (error) {
      showAlert("Failed", "error");
    }
  });
}
