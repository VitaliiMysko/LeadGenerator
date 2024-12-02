import { dataContainerElement } from "../../helper/dom-helper.js";

let dragged;

document.addEventListener(
  "dragstart",
  function (event) {
    dragged = event.target;
    setTimeout(() => (dragged.style.opacity = "0.5"), 0);
  },
  false
);

document.addEventListener(
  "dragend",
  function (event) {
    dragged.style.opacity = "";
  },
  false
);

document.addEventListener(
  "dragover",
  function (event) {
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "drop",
  function (event) {
    event.preventDefault();
    if (event.target.classList.contains("draggable-block")) {
      if (dragged !== event.target) {
        const draggedIndex = Array.from(dataContainerElement.children).indexOf(
          dragged
        );
        const targetIndex = Array.from(dataContainerElement.children).indexOf(
          event.target
        );

        if (draggedIndex > targetIndex) {
          dataContainerElement.insertBefore(dragged, event.target);
        } else {
          dataContainerElement.insertBefore(dragged, event.target.nextSibling);
        }
      }
    }
  },
  false
);
