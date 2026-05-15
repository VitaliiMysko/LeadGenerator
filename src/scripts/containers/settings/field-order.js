import { setOnDropCallback } from "../../feature/drag-and-drop.js";
import { getFromStorage, setToStorage } from "./common.js";
import { dataContainerElement } from "../../helper/dom-helper.js";

function getFieldOrder() {
  return Array.from(dataContainerElement.querySelectorAll(".draggable-block"))
    .map((block) => block.querySelector("input")?.id)
    .filter(Boolean);
}

function applyFieldOrder(order) {
  const blockMap = new Map(
    Array.from(dataContainerElement.querySelectorAll(".draggable-block")).map(
      (block) => [block.querySelector("input")?.id, block],
    ),
  );
  for (const id of order) {
    const block = blockMap.get(id);
    if (block) dataContainerElement.appendChild(block);
  }
}

export async function initFieldOrder() {
  const settingsElement = document.getElementById("field-order-settings");
  const enabled = !!(await getFromStorage("fieldOrderEnabled"));
  const savedOrder = await getFromStorage("fieldOrder");

  settingsElement.checked = enabled;

  if (enabled && Array.isArray(savedOrder) && savedOrder.length) {
    applyFieldOrder(savedOrder);
  }

  setOnDropCallback(async () => {
    if (settingsElement.checked) {
      await setToStorage("fieldOrder", getFieldOrder());
    }
  });

  settingsElement.addEventListener("change", async (e) => {
    await setToStorage("fieldOrderEnabled", e.target.checked);
  });
}
