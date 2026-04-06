import { dataContainerElement } from "../helper/dom-helper.js";

let dragged;
let initialized = false;

const handleDragStart = function (event) {
  dragged = event.target;
  setTimeout(() => (dragged.style.opacity = "0.5"), 0);
};

const handleDragEnd = function (event) {
  dragged.style.opacity = "";
};

const handleDragOver = function (event) {
  event.preventDefault();
};

const handleDrop = function (event) {
  event.preventDefault();
  if (event.target.classList.contains("draggable-block")) {
    if (dragged !== event.target) {
      const draggedIndex = Array.from(dataContainerElement.children).indexOf(
        dragged,
      );
      const targetIndex = Array.from(dataContainerElement.children).indexOf(
        event.target,
      );

      if (draggedIndex > targetIndex) {
        dataContainerElement.insertBefore(dragged, event.target);
      } else {
        dataContainerElement.insertBefore(dragged, event.target.nextSibling);
      }
    }
  }
};

export function enableDragAndDrop() {
  if (initialized) return;

  const blocks = document.querySelectorAll(".draggable-block");

  blocks.forEach((block) => {
    block.classList.add("enabled");
    block.setAttribute("draggable", "true");

    block.addEventListener("dragstart", handleDragStart);
    block.addEventListener("dragend", handleDragEnd);
    block.addEventListener("dragover", handleDragOver);
    block.addEventListener("drop", handleDrop);
  });

  initialized = true;
}

export function disableDragAndDrop() {
  const blocks = document.querySelectorAll(".draggable-block");

  blocks.forEach((block) => {
    block.classList.remove("enabled");
    block.removeAttribute("draggable");

    block.removeEventListener("dragstart", handleDragStart);
    block.removeEventListener("dragend", handleDragEnd);
    block.removeEventListener("dragover", handleDragOver);
    block.removeEventListener("drop", handleDrop);
  });

  initialized = false;
}
