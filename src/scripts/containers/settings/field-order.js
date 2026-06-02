import { setOnDropCallback } from "../../features/drag-and-drop.js";
import { syncGet, syncSet } from "../../utils/chrome-storage.js";
import { getDataContainerElement } from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";

function getFieldOrder() {
  return Array.from(getDataContainerElement().querySelectorAll(".draggable-block"))
    .map((block) => block.querySelector("input")?.id)
    .filter(Boolean);
}

function applyFieldOrder(order) {
  const blockMap = new Map(
    Array.from(getDataContainerElement().querySelectorAll(".draggable-block")).map(
      (block) => [block.querySelector("input")?.id, block],
    ),
  );
  for (const id of order) {
    const block = blockMap.get(id);
    if (block) getDataContainerElement().appendChild(block);
  }
}

export async function initFieldOrder() {
  const settingsElement = document.getElementById("field-order-settings");
  const enabled = await syncGet("fieldOrderEnabled", true);
  const savedOrder = await syncGet("fieldOrder");

  settingsElement.checked = enabled;

  if (enabled && Array.isArray(savedOrder) && savedOrder.length) {
    applyFieldOrder(savedOrder);
  }

  setOnDropCallback(async () => {
    if (settingsElement.checked) {
      await syncSet("fieldOrder", getFieldOrder());
    }
  });

  settingsElement.addEventListener("change", async (e) => {
    const isEnabled = e.target.checked;
    try {
      await syncSet("fieldOrderEnabled", isEnabled);
      if (isEnabled) {
        await syncSet("fieldOrder", getFieldOrder());
      }
      showAlert("Done", "success");
    } catch (error) {
      showAlert("Failed", "error");
    }
  });
}
