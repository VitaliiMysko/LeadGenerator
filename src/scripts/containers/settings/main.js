import { initDragAndDrop } from "./drag-and-drop.js";
import { initTransliteration } from "./transliteration.js";
import { initFieldOrder } from "./field-order.js";

export async function initSettings() {
  await initFieldOrder();
  await initDragAndDrop();
  await initTransliteration();
}
