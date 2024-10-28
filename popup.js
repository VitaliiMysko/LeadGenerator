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
        



        const options = [
          { id: "option1", label: "Option 1 skjdhf khyhhsd fiuwer fds f f" },
          { id: "option2", label: "Option 2" },
          { id: "option3", label: "Option 3" }
        ];

        createRadioButtons("radio-container", options);




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

function createRadioButtons(containerId, options) {
  const container = document.getElementById(containerId);

  // Очищення контейнера перед заповненням нових елементів
  container.innerHTML = '';

  // Перебираємо кожний об'єкт у масиві options
  options.forEach((option, index) => {
    // Створення <div> для кожного радіо-елемента
    const radioWrapper = document.createElement("div");
    radioWrapper.className = "radio-item"; // клас для стилізації

    // Створення елемента <input> типу radio
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.id = option.id;
    radioInput.name = "options"; // Всі радіо-кнопки мають однакове ім'я для групування
    radioInput.value = option.id;

    // Робимо перший елемент вибраним за замовчуванням
    if (index === 0) {
      radioInput.checked = true;
    }

    // Створення <label> для відображення тексту
    const radioLabel = document.createElement("label");
    radioLabel.setAttribute("for", option.id);
    radioLabel.textContent = option.label;

    // Додавання радіо-кнопки та мітки до контейнера
    radioWrapper.appendChild(radioInput);
    radioWrapper.appendChild(radioLabel);
    container.appendChild(radioWrapper);
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
