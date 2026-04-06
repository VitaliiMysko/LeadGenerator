import { initDragAndDrop } from "./drag-and-drop-data.js";
import { initTransliteration } from "./transliteration.js";

export async function initSettings() {
  await initDragAndDrop();
  await initTransliteration();
}
