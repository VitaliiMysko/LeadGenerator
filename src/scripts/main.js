import {
  getBtnElement,
  copyBtnElement,
  jobPositionElement,
  companyNameElement,
} from "./dom-manager.js";

getBtnElement.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["src/content-scripts/extract-data.js"],
      },
      () => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getData" },
          (results) => {
            if (results) {
              const data = results.data;
              data.forEach((element) => {
                if (element.category === "generalData") {
                  populateGeneralData(element.value);
                }
                if (element.category === "comany&jobPosition") {
                  createRadioListButtons("radio-list-container", element.value);
                }
              });
            }
          }
        );
      }
    );
  });
});

function populateGeneralData(items) {
  items.forEach((item) => {
    if (item.inputId == "first-name" || item.inputId == "second-name") {
      document.querySelector(`#${item.inputId}`).value = transliterate(
        item.value
      );
    } else {
      document.querySelector(`#${item.inputId}`).value = item.value;
    }
  });
}

function createRadioListButtons(containerId, items) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  items.forEach((item, index) => {
    const radioItem = document.createElement("div");
    radioItem.classList.add("radio-company");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "options";
    radio.id = `radio-company-${item.id}`;
    radio.value = item.id;

    const label = document.createElement("label");
    label.setAttribute("for", `radio-company-${item.id}`);

    if (item.link != "") {
      const link = document.createElement("a");
      link.href = item.link;
      link.textContent = item.name;

      label.appendChild(link);
    } else {
      label.textContent = item.name;
    }

    const infoBlock = document.createElement("div");
    infoBlock.classList.add("extra-company-data");
    infoBlock.textContent = item.jobPosition;

    if (index === 0) {
      radio.checked = true;
      jobPositionElement.value = infoBlock.textContent;
      companyNameElement.value = item.name;
    }

    radio.addEventListener("change", () => {
      if (radio.checked) {
        jobPositionElement.value = infoBlock.textContent;
        companyNameElement.value = item.name;
      }
    });

    radioItem.appendChild(radio);
    radioItem.appendChild(label);
    radioItem.appendChild(infoBlock);

    container.appendChild(radioItem);
  });
}

//>>>>>>>>>>>>>>>>>>COPY INTO BUFFER<<<<<<<<<<<<<<<<<<
copyBtnElement.addEventListener("click", function () {
  copyToBuffer();
});

function copyToBuffer() {
  const inputs = document.querySelectorAll("#data-container input");
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
