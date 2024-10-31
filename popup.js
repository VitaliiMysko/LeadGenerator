document.getElementById("getDataButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getData,
      },
      (results) => {
        if (results && results[0]) {
          const data = results[0].result;
          data.forEach((element) => {
            if (element.category === "generalData") {
              populateGeneralData(element.value);
            }

            if (element.category === "comany&jobPosition") {
              createRadioListButtons("radio-list-container", element.value);
            }
          });
        }
        copyToBuffer();
      }
    );
  });
});

function getData() {
  let data = [];

  let generalData = [];
  let companiesAndJobPosition = [];

  try {
    generalData = getGeneralData();
    companiesAndJobPosition = getCompaniesAndJobPosition();
  } catch (error) {
    console.log("Probably, something bad happened with getting data");
    console.log(error.message);
  }

  data.push({ category: "generalData", value: generalData });
  data.push({ category: "comany&jobPosition", value: companiesAndJobPosition });

  return data;

  //>>>>>>>>>>>>>>>>>>GET GENERAL_DATA<<<<<<<<<<<<<<<<<<
  function getGeneralData() {
    let generalData = [];
    const fullName = getFullName();
    generalData.push({ inputId: "firstName", value: getFirstName(fullName) });
    generalData.push({ inputId: "secondName", value: getSecondName(fullName) });
    generalData.push({ inputId: "jobPosition", value: getJobPosition() });
    generalData.push({ inputId: "link", value: getLinkedinLink() });

    return generalData;
  }

  function getFullName() {
    const element = document.querySelector(
      'h1[data-x--lead--name][data-anonymize="person-name"]'
    );
    return element.textContent.trim();
  }

  function getFirstName(fullName) {
    let [firstName] = fullName.includes(" ") ? fullName.split(" ") : "";
    return firstName.trim();
  }

  function getSecondName(fullName) {
    let [, ...remainingWords] = fullName.split(" ");
    let secondName = remainingWords.length > 0 ? remainingWords.join(" ") : "";
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
    let link = element ? element.href : "";
    return link.trim();
  }

  //>>>>>>>>>>>>>>>>>>GET GENERAL_DATA<<<<<<<<<<<<<<<<<<
  function getCompaniesAndJobPosition() {
    let comanyjobPositionData = [];

    const companyComponents = document.querySelectorAll(
      "._experience-entry_1irc72"
    );

    let id = 0;

    for (const companyComponent of companyComponents) {
      let name = "";
      let link = "";
      let jobPosition = "";

      const companyDataElement = companyComponent.children[0].children[1];

      link = GetCompanyLink(companyDataElement);
      name = GetCompanyName(companyDataElement);

      const jobPositionElement = GetJobPositionElement(companyDataElement);

      if (jobPositionElement) {
        jobPosition = jobPositionElement.textContent.trim();

        const actualPositionElement = companyDataElement.children[2];

        if (IsActualJobPosition(actualPositionElement)) {
          if (name != "" && jobPosition != "") {
            comanyjobPositionData.push({
              id: ++id,
              name: name,
              jobPosition: jobPosition,
              link: link,
            });
          }
        } else {
          break;
        }
      } else {
        const multiPositionCompanyComponent =
          companyComponent.querySelector("ul");

        if (multiPositionCompanyComponent) {
          const positionComponents =
            multiPositionCompanyComponent.querySelectorAll("li");

          for (const positionComponent of positionComponents) {
            const jobPositionElement = GetJobPositionElement(positionComponent);

            if (jobPositionElement) {
              jobPosition = jobPositionElement.textContent.trim();
            }

            const actualPositionElement =
              positionComponent.children[1].children[1];

            if (IsActualJobPosition(actualPositionElement)) {
              if (name != "" && jobPosition != "") {
                comanyjobPositionData.push({
                  id: ++id,
                  name: name,
                  jobPosition: jobPosition,
                  link: link,
                });
              }
            } else {
              break;
            }
          }
        }
      }
    }
    return comanyjobPositionData;
  }

  function GetCompanyLink(element) {
    let link = "";

    const linkElement = element.querySelector("a");

    if (linkElement) {
      link = linkElement.href;
      link = link.includes("sales/company") ? link : "";
    }
    return link;
  }

  function GetCompanyName(element) {
    let name = "";
    let companyElement = element.querySelector(
      '[data-anonymize="company-name"]'
    );

    if (companyElement) {
      name = companyElement.textContent.trim();
    }
    return name;
  }

  function GetJobPositionElement(element) {
    return element.querySelector('[data-anonymize="job-title"]');
  }

  function IsActualJobPosition(element) {
    if (element) {
      const periodElement = element.querySelector("span");

      if (periodElement) {
        const period = periodElement.textContent.trim();
        return period.includes("Present");
      }
    }
  }
}
function populateGeneralData(items) {
  items.forEach((item) => {
    document.querySelector(`#${item.inputId} input`).value = item.value;
  });
}

function createRadioListButtons(containerId, items) {
  // Контейнер для списку радіо-кнопок
  const container = document.getElementById(containerId);

  // Очищення контейнера перед заповненням нових елементів
  container.innerHTML = "";
  
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
    // label.textContent = item.name;

    if (item.link != "")
    {
      const link = document.createElement("a");
      link.href = item.link;
      link.textContent = item.name;

      label.appendChild(link);
    }else{
      label.textContent = item.name;
    }

    // Створення додаткового блоку інформації
    const infoBlock = document.createElement("div");
    infoBlock.classList.add("info-block");
    infoBlock.textContent = item.jobPosition;

    if (index === 0) {
      radio.checked = true;
      document.querySelector(`#jobPosition input`).value =
        infoBlock.textContent;
    }

    // Обробка події при виборі радіо-кнопки
    radio.addEventListener("change", () => {
      if (radio.checked) {
        document.querySelector(`#jobPosition input`).value =
          infoBlock.textContent;
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
