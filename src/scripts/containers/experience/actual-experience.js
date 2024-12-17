import {
  jobPositionElement,
  companyNameElement,
  experienceContainerElement,
} from "../../helper/dom-helper.js";

export function createRadioCompaniesList(experience) {
  experienceContainerElement.innerHTML = "";

  experience.forEach((company, index) => {
    const radioCompanyBlock = GetRadioCompanyBlock(company, index);
    experienceContainerElement.appendChild(radioCompanyBlock);
  });

  AddCompanyWebsiteListener();
}

function GetRadioCompanyBlock(company, index) {
  const radioCompanyBlock = document.createElement("div");
  radioCompanyBlock.classList.add("radio-company");

  const radioItem = GetCompanyRadioElement(company);
  const companyLabelElement = GetCompanyLabelElement(company);
  const currentCompanyJobElement = GetCurrentCompanyJobElement(company);
  const currentCompanyWebsiteElement = GetCurrentCompanyWebiteElement(company);

  let showWebSiteBlock = false;

  if (index === 0) {
    radioItem.checked = true;
    jobPositionElement.value = currentCompanyJobElement.textContent;
    companyNameElement.value = company.companyName;

    const webSiteLink = GetCompanyWebSite();

    currentCompanyWebsiteElement.setAttribute("check", true);

    if (webSiteLink != "") {
      showWebSiteBlock = true;
      currentCompanyWebsiteElement.textContent = webSiteLink;
      const isWorkingWebSite = IsWorkingCompanyWebSite(webSiteLink);
      currentCompanyWebsiteElement.setAttribute("working", isWorkingWebSite);
    }
  }

  if (showWebSiteBlock) {
    currentCompanyWebsiteElement.style.display = "block";
  } else {
    currentCompanyWebsiteElement.style.display = "none";
  }

  console.log("radioCompanyBlock");

  radioCompanyBlock.appendChild(radioItem);
  radioCompanyBlock.appendChild(companyLabelElement);
  radioCompanyBlock.appendChild(currentCompanyJobElement);
  radioCompanyBlock.appendChild(currentCompanyWebsiteElement);

  return radioCompanyBlock;
}

function GetCompanyRadioElement(company) {
  const radioItem = document.createElement("input");
  radioItem.type = "radio";
  radioItem.name = "options";
  radioItem.id = `radio-company-${company.id}`;
  radioItem.value = company.id;

  return radioItem;
}

function GetCompanyLabelElement(company) {
  const label = document.createElement("label");
  label.setAttribute("for", `radio-company-${company.id}`);

  if (company.companylink != "") {
    const link = document.createElement("a");
    link.href = company.companylink;
    link.textContent = company.companyName;

    label.appendChild(link);
  } else {
    label.textContent = company.companyName;
  }
  return label;
}

function GetCurrentCompanyJobElement(company) {
  const currentJobElement = document.createElement("div");
  currentJobElement.classList.add("current-company-job");
  currentJobElement.textContent = company.jobPosition;

  return currentJobElement;
}

function GetCurrentCompanyWebiteElement(company) {
  const currentWebSiteElement = document.createElement("div");
  currentWebSiteElement.classList.add("current-company-website");
  currentWebSiteElement.setAttribute("check", false);
  currentWebSiteElement.setAttribute("working", false);

  return currentWebSiteElement;
}

function GetCompanyWebSite() {
  let webSite = "";
  // if (company.companylink != "") {
  //   webSite = "https://zentrum-garage.ch/";
  // }
  webSite = "https://zentrum-garage.ch/";

  return webSite;
}

function IsWorkingCompanyWebSite(link) {
  return true;
}

function AddCompanyWebsiteListener() {
  const radioButtons = document.querySelectorAll(
    '#experience-container input[type="radio"]'
  );

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      console.log(11);

      const allWebsites = document.querySelectorAll(".current-company-website");
      allWebsites.forEach((site) => (site.style.display = "none"));

      if (radio.checked) {
        console.log(22, radio);
        const parentDiv = radio.closest(".radio-company");
        const websiteBlock = parentDiv.querySelector(
          ".current-company-website"
        );

        if (websiteBlock) {
          console.log(33);
          websiteBlock.style.display = "block";
        }
      }
    });
  });
}
