let dragged;

// Починаємо перетягування елемента
document.addEventListener(
  "dragstart",
  function (event) {
    // Зберігаємо посилання на перетягуваний елемент
    dragged = event.target;
    // Трохи затримуємо прозорість для візуального ефекту
    setTimeout(() => (dragged.style.opacity = "0.5"), 0);
  },
  false
);

// Коли елемент залишає зону перетягування
document.addEventListener(
  "dragend",
  function (event) {
    // Повертаємо прозорість після завершення перетягування
    dragged.style.opacity = "";
  },
  false
);

// Дозволяємо перетягування елемента над іншим елементом
document.addEventListener(
  "dragover",
  function (event) {
    event.preventDefault();
  },
  false
);

// Скидання елемента в нову позицію
document.addEventListener(
  "drop",
  function (event) {
    event.preventDefault();
    if (event.target.classList.contains("draggable-input")) {
      // Міняємо місцями перетягуваний елемент та ціль
      if (dragged !== event.target) {
        const container = document.getElementById("input-container");
        const draggedIndex = Array.from(container.children).indexOf(dragged);
        const targetIndex = Array.from(container.children).indexOf(
          event.target
        );

        // Міняємо місцями перетягуваний і цільовий елементи
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
