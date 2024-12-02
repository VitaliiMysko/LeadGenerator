import {
  jobPositionElement,
  companyNameElement,
  radioListContainerElement,
} from "../../helper/dom-helper.js";

export function createRadioCompaniesList(companies) {
  radioListContainerElement.innerHTML = "";

  companies.forEach((company, index) => {
    const radioCompanyBlock = document.createElement("div");
    radioCompanyBlock.classList.add("radio-company");

    const radioItem = document.createElement("input");
    radioItem.type = "radio";
    radioItem.name = "options";
    radioItem.id = `radio-company-${company.id}`;
    radioItem.value = company.id;

    const label = document.createElement("label");
    label.setAttribute("for", `radio-company-${company.id}`);

    if (company.link != "") {
      const link = document.createElement("a");
      link.href = company.link;
      link.textContent = company.name;

      label.appendChild(link);
    } else {
      label.textContent = company.name;
    }

    const extraCompanyData = document.createElement("div");
    extraCompanyData.classList.add("extra-company-data");
    extraCompanyData.textContent = company.jobPosition;

    if (index === 0) {
      radioItem.checked = true;
      jobPositionElement.value = extraCompanyData.textContent;
      companyNameElement.value = company.name;
    }

    radioItem.addEventListener("change", () => {
      if (radioItem.checked) {
        jobPositionElement.value = extraCompanyData.textContent;
        companyNameElement.value = company.name;
      }
    });

    radioCompanyBlock.appendChild(radioItem);
    radioCompanyBlock.appendChild(label);
    radioCompanyBlock.appendChild(extraCompanyData);

    radioListContainerElement.appendChild(radioCompanyBlock);
  });
}
