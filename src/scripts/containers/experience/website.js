import {
  getRadioButtonElements,
  getCompanyNameElements,
  getCompanyJobElements,
  getCompanyWebsiteElements,
  emailElement,
  generateEmailsBtnElement,
  companyIndustryElement
} from "../../helper/dom-helper.js";

import { getBasicEmail, fillEmailFromCache } from "../../services/email.js";

import { addCopyByClick, setValidationStyle } from "../../helper/dom-action.js";

const websiteDataByDefault = { url: "", status: 0, ok: false };

export async function handlerCompanyWebsite() {
  await initCompanyWebsite();
  await addCompanyWebsiteListener();
}

async function addCompanyWebsiteListener() {
  getRadioButtonElements().forEach(async (radio) => {
    radio.addEventListener("change", async () => {
      await manageWebsiteBlock(radio);
      fillEmailFromCache();
    });
  });
}

async function initCompanyWebsite() {
  getRadioButtonElements().forEach(async (radio) => {
    if (radio.checked) {
      await manageWebsiteBlock(radio);
    }
  });
}

async function manageWebsiteBlock(radio) {
  getCompanyNameElements().forEach((label) => label.classList.remove("active"));
  getCompanyJobElements().forEach((job) => job.classList.remove("active"));
  getCompanyWebsiteElements().forEach((website) => {
    website.classList.remove("active");
    website.style.display = "none";
  });

  const parentDiv = radio.closest(".radio-company");
  const companyNameLabel = parentDiv.querySelector(".company-name");
  companyNameLabel.classList.add("active");

  const companyJobElement = parentDiv.querySelector(".company-job");
  companyJobElement.classList.add("active");

  const websiteBlock = parentDiv.querySelector(".company-website");
  websiteBlock.classList.add("active");

  const companyLinkElement = parentDiv.querySelector("a");

  websiteBlock.style.display = "flex";

  if (websiteBlock.getAttribute("data-initialized") === "true") {
    websiteBlock.style.display = "flex";
    return;
  }

  if (websiteBlock.getAttribute("data-loading") === "true") {
    return;
  }
  websiteBlock.setAttribute("data-loading", "true");

  websiteBlock.innerHTML = "";
  websiteBlock.classList.add("loading");

  const websiteIconElement = getWebsiteIconElement();
  const websiteLoadingTextElement = getWebsiteSpanElement("Loading");

  websiteBlock.appendChild(websiteIconElement);
  websiteBlock.appendChild(websiteLoadingTextElement);

  try {
    emailElement.disabled = true;
    generateEmailsBtnElement.disabled = true;

    let websiteData = companyLinkElement
      ? await getCompanyData(companyLinkElement.href)
      : { ...websiteDataByDefault };

    emailElement.disabled = false;
    generateEmailsBtnElement.disabled = false;

    websiteBlock.innerHTML = "";

    let websiteUrl = "No website found";
    if (websiteData.url) {
      const websiteLinkElement = getWebsiteLinkElement(websiteData.url);
      websiteLinkElement.appendChild(websiteIconElement);
      websiteBlock.appendChild(websiteLinkElement);
      websiteUrl = getHostName(websiteData.url);
      const basicEmail = getBasicEmail.bind(null, websiteUrl);
      addCopyByClick(websiteBlock, "span", basicEmail, "baic email");
      setValidationStyle(websiteBlock, websiteData.ok);
    } else {
      websiteBlock.appendChild(websiteIconElement);
    }

    if(websiteData.industry){
      companyIndustryElement.value = websiteData.industry
    }

    const websiteElement = getWebsiteSpanElement(websiteUrl);
    websiteBlock.appendChild(websiteElement);

    websiteBlock.setAttribute("data-initialized", "true");
  } catch (error) {
    websiteBlock.innerHTML = "Error loading website.";
    console.error("Error fetching website:", error);
  } finally {
    websiteBlock.removeAttribute("data-loading");
    websiteBlock.classList.remove("loading");
  }
}

function getWebsiteIconElement() {
  const websiteIconElement = document.createElement("img");
  websiteIconElement.src = "assets/icons/www-16.png";
  websiteIconElement.alt = "Website Icon";
  return websiteIconElement;
}

function getWebsiteSpanElement(websiteData) {
  const websiteSpanElement = document.createElement("span");
  websiteSpanElement.textContent = websiteData;
  return websiteSpanElement;
}

function getWebsiteLinkElement(websiteData) {
  const websiteLinkElement = document.createElement("a");
  websiteLinkElement.href = websiteData;
  websiteLinkElement.target = "_blank";
  return websiteLinkElement;
}

function getHostName(url) {
  try {
    const hostname = new URL(url).hostname;
    const cleanHostname = hostname.replace(/^www\./, "");

    return cleanHostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
}

const websiteCache = new Map();

async function getCompanyData(companylink) {
  if (websiteCache.has(companylink)) {
    return websiteCache.get(companylink);
  }

  let websiteData = "";
  if (companylink) {
    try {
      const response = await sendMessagePromise({
        action: "fetchPage",
        url: companylink,
      });
      console.log(response)

      if (response) {
        websiteData = response;
      } else {
        websiteData = { ...websiteDataByDefault };
      }
    } catch (error) {
      websiteData = { ...websiteDataByDefault };
      console.error("Error fetching website data:", error);
    }
  } else {
    websiteData = { ...websiteDataByDefault };
  }
  websiteCache.set(companylink, websiteData);
  return websiteData;
}

function sendMessagePromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}
