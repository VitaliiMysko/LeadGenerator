document.getElementById("getDataButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getData,
      },
      (results) => {
        if (results && results[0]) {
          // console.log("results ==! >", results);
          const data = results[0].result;
          // console.log("data ==! >", data);
          data.forEach((element) => {
            document.querySelector(`#${element.inputId} input`).value =
              element.value;
            console.log("value ==! >", element.value);
          });
        }

        const items = [
          { id: 1, label: "Company A", info: "IT Director" },
          { id: 2, label: "Company B", info: "Head of Information Technology" },
          { id: 3, label: "Company C", info: "Co-Founder & Chief Operating Officer" }
        ];

        createRadioListButtons("radio-list-container", items);

        copyToBuffer();
      }
    );
  });
});

function getData() {
  let data = [];

  const fullName = getFullName();
  data.push({ inputId: "firstName", value: getFirstName(fullName) });
  data.push({ inputId: "secondName", value: getSecondName(fullName) });
  data.push({ inputId: "jobPosition", value: getJobPosition() });
  data.push({ inputId: "link", value: getLinkedinLink() });

  return data;

  function getFullName() {
    const element = document.querySelector(
      'h1[data-x--lead--name][data-anonymize="person-name"]'
    );
    // console.log(element.textContent.trim());
    return element.textContent.trim();
  }

  function getFirstName(fullName) {
    let [firstName] = fullName.includes(" ") ? fullName.split(" ") : "";
    // console.log("getFirstName", firstName.trim());
    return firstName.trim();
  }

  function getSecondName(fullName) {
    let [, ...remainingWords] = fullName.split(" ");
    // console.log("getSecondName == >", remainingWords);
    let secondName = remainingWords.length > 0 ? remainingWords.join(" ") : "";
    // console.log("getSecondName", secondName.trim());
    return secondName.trim();
  }

  function getJobPosition() {
    return "";
  }

  function getLinkedinLink() {
    let xpath = "//a[contains(@href, 'https://www.linkedin.com/in/')]"; // XPath вираз

    let result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

    let element = result.singleNodeValue;
    console.log("link element", element);
    let link = element ? element.href : "";
    console.log("link", link.trim());
    return link.trim();
  }
}

function createRadioListButtons(containerId, items) {
  // Контейнер для списку радіо-кнопок
  const container = document.getElementById(containerId);

    // Очищення контейнера перед заповненням нових елементів
    container.innerHTML = '';

  // Динамічне створення списку
  items.forEach((item, index) => {
    // Створення елемента обгортки
    const radioItem = document.createElement("div");
    radioItem.classList.add("radio-item");

    // Створення елемента радіо-кнопки
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "options";
    radio.id = `radio-${item.id}`;
    radio.value = item.id;

    // Створення мітки для радіо-кнопки
    const label = document.createElement("label");
    label.setAttribute("for", `radio-${item.id}`);
    label.textContent = item.label;

    // Створення додаткового блоку інформації
    const infoBlock = document.createElement("div");
    infoBlock.classList.add("info-block");
    infoBlock.textContent = item.info;

    if (index === 0) {
      radio.checked = true;
      document.querySelector(`#jobPosition input`).value = infoBlock.textContent;
    }

    // Обробка події при виборі радіо-кнопки
    radio.addEventListener("change", () => {
      if (radio.checked) {
        document.querySelector(`#jobPosition input`).value = infoBlock.textContent;
      }
    });

    // Додавання елементів до обгортки
    radioItem.appendChild(radio);
    radioItem.appendChild(label);
    radioItem.appendChild(infoBlock);

    // Додавання обгортки до контейнера
    container.appendChild(radioItem);
  });
}

//>>>>>>>>>>>>>>>>>>COPY INTO BUFFER<<<<<<<<<<<<<<<<<<
document.getElementById("copy").addEventListener("click", function () {
  copyToBuffer();
});

function copyToBuffer() {
  const inputs = document.querySelectorAll("#input-container input");
  const values = Array.from(inputs)
    .map((input) => input.value)
    .join("\t");

  navigator.clipboard
    .writeText(values)
    .then(() => {
      showInfo("Copy successful!", "success", 3000);
    })
    .catch((err) => {
      console.error("Copied fault: ", err);
      showInfo("Copy failed!", "error", 3000);
    });
}

function showInfo(message, type = "success", duration = 3000) {
  const info = document.getElementById("info");
  info.textContent = message;

  info.classList.add("show", type);

  setTimeout(() => {
    info.classList.remove("show", type);
  }, duration);
}



//>>>>>>>>>>>>>>>>>>DRAGGED<<<<<<<<<<<<<<<<<<
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
