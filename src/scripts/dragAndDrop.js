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
    if (event.target.classList.contains("draggable-input")) {
      if (dragged !== event.target) {
        const container = document.getElementById("input-container");
        const draggedIndex = Array.from(container.children).indexOf(dragged);
        const targetIndex = Array.from(container.children).indexOf(
          event.target
        );

        if (draggedIndex > targetIndex) {
          container.insertBefore(dragged, event.target);
        } else {
          container.insertBefore(dragged, event.target.nextSibling);
        }
      }
    }
  },
  false
);
