import { getDragAndDropSettingsElement } from "../../helper/dom-helper.js";

import {
  enableDragAndDrop,
  disableDragAndDrop,
} from "../data/drag-and-drop-data.js";

document.addEventListener("DOMContentLoaded", () => {
  const dragAndDropSettingsElement = getDragAndDropSettingsElement();
  if (dragAndDropSettingsElement == null) return;

  chrome.storage.sync.get("dragAndDropEnabled", (data) => {
    const enabled = !!data.dragAndDropEnabled;
    dragAndDropSettingsElement.checked = enabled;
    if (enabled) {
      enableDragAndDrop();
    } else {
      disableDragAndDrop();
    }
  });

  dragAndDropSettingsElement.addEventListener("change", (e) => {
    const enabled = e.target.checked;

    chrome.storage.sync.set({
      dragAndDropEnabled: enabled,
    });

    if (enabled) {
      enableDragAndDrop();
    } else {
      disableDragAndDrop();
    }
  });
});
