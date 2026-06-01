import { getDataContainerElement } from "../helper/dom-helper.js";

let dragged;
let initialized = false;
let onDropCallback = null;

export function setOnDropCallback(fn) {
  onDropCallback = fn;
}

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
  const dropTarget = event.target.closest(".draggable-block");
  if (dropTarget && dragged !== dropTarget) {
    const draggedIndex = Array.from(getDataContainerElement().children).indexOf(
      dragged,
    );
    const targetIndex = Array.from(getDataContainerElement().children).indexOf(
      dropTarget,
    );

    if (draggedIndex > targetIndex) {
      getDataContainerElement().insertBefore(dragged, dropTarget);
    } else {
      getDataContainerElement().insertBefore(dragged, dropTarget.nextSibling);
    }

    if (onDropCallback) onDropCallback();
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
