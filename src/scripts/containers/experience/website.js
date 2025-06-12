import {
  getRadioButtonElements,
  getCompanyNameElements,
  getCompanyJobElements,
  getCompanyWebsiteElements,
  getCompanyIndustryElements,
  getCompanyLocationElements,
  emailElement,
  generateEmailsBtnElement,
  companyIndustryElement,
  companyCountryElement,
} from "../../helper/dom-helper.js";

import { getBasicEmail, fillEmailFromCache } from "../../services/email.js";

import { addCopyByClick, setValidationStyle } from "../../helper/dom-action.js";

const websiteDataByDefault = {
  url: "",
  industry: "",
  location: "",
  status: 0,
  ok: false,
};

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
  getCompanyIndustryElements().forEach((industry) => {
    industry.classList.remove("active");
    industry.style.display = "none";
  });
  getCompanyLocationElements().forEach((country) => {
    country.classList.remove("active");
    country.style.display = "none";
  });

  const parentDiv = radio.closest(".radio-company");
  const companyNameLabel = parentDiv.querySelector(".company-name");
  companyNameLabel.classList.add("active");

  const companyJobElement = parentDiv.querySelector(".company-job");
  companyJobElement.classList.add("active");

  const websiteBlock = parentDiv.querySelector(".company-website");
  websiteBlock.classList.add("active");

  const industryBlock = parentDiv.querySelector(".company-industry");
  industryBlock.classList.add("active");

  const locationBlock = parentDiv.querySelector(".company-location");
  locationBlock.classList.add("active");

  const companyLinkElement = parentDiv.querySelector("a");

  websiteBlock.style.display = "flex";
  industryBlock.style.display = "flex";
  locationBlock.style.display = "flex";

  if (
    websiteBlock.getAttribute("data-initialized") === "true" ||
    websiteBlock.getAttribute("data-loading") === "true"
  ) {
    return;
  }

  websiteBlock.setAttribute("data-loading", "true");
  industryBlock.setAttribute("data-loading", "true");
  locationBlock.setAttribute("data-loading", "true");

  websiteBlock.innerHTML = "";
  industryBlock.innerHTML = "";
  locationBlock.innerHTML = "";
  websiteBlock.classList.add("loading");
  industryBlock.classList.add("loading");
  locationBlock.classList.add("loading");

  const websiteIconElement = getWebsiteIconElement();
  const editWebsiteDomainElement = getEditWebsiteDomainElement();
  const websiteLoadingTextElement = getSpanElement("Loading website");
  const countryLoadingTextElement = getSpanElement("Loading country");
  const industryLoadingTextElement = getSpanElement("Loading industry");

  websiteBlock.appendChild(websiteIconElement);
  websiteBlock.appendChild(websiteLoadingTextElement);
  locationBlock.appendChild(countryLoadingTextElement);
  industryBlock.appendChild(industryLoadingTextElement);

  try {
    emailElement.disabled = true;
    generateEmailsBtnElement.disabled = true;

    let websiteData = companyLinkElement
      ? await getCompanyData(companyLinkElement.href)
      : { ...websiteDataByDefault };

    emailElement.disabled = false;
    generateEmailsBtnElement.disabled = false;

    websiteBlock.innerHTML = "";
    industryBlock.innerHTML = "";
    locationBlock.innerHTML = "";

    let websiteUrl = "No website found";
    if (websiteData.url) {
      const websiteLinkElement = getWebsiteLinkElement(websiteData.url);
      websiteLinkElement.appendChild(websiteIconElement);
      websiteBlock.appendChild(websiteLinkElement);
      websiteUrl = getHostName(websiteData.url);
      const basicEmail = getBasicEmail.bind(null, websiteUrl);
      addCopyByClick(websiteBlock, "span", basicEmail, "basic email");
      setValidationStyle(websiteBlock, websiteData.ok);
    } else {
      websiteBlock.appendChild(websiteIconElement);
    }

    let industry = "No industry found";
    industry = websiteData.industry === "" ? industry : websiteData.industry;
    const industryTextElement = getSpanElement(industry);
    industryBlock.appendChild(industryTextElement);

    if (radio.checked && industry !== "No industry found") {
      companyIndustryElement.value = industryTextElement.textContent;
    }

    let location = "No location found"
    location = websiteData.location === "" ? location : websiteData.location;
    const locationTextElement = getSpanElement(location);
    locationBlock.appendChild(locationTextElement);

    if (radio.checked && location !== "No location found") {
      companyCountryElement.value = locationTextElement.textContent.split(', ').pop();
    }

    const websiteElement = getSpanElement(websiteUrl);
    websiteBlock.appendChild(websiteElement);
    websiteBlock.appendChild(editWebsiteDomainElement);

    websiteBlock.setAttribute("data-initialized", "true");

    editWebsiteDomain(websiteElement, editWebsiteDomainElement, {
      onSave: (newValue) => {
        const newBasicEmail = getBasicEmail.bind(null, newValue);
        addCopyByClick(websiteBlock, "span", newBasicEmail, "basic email");
      },
    });
  } catch (error) {
    websiteBlock.innerHTML = "Error loading website.";
    console.error("Error fetching website:", error);
  } finally {
    websiteBlock.removeAttribute("data-loading");
    websiteBlock.classList.remove("loading");
    industryBlock.classList.remove("loading");
    locationBlock.classList.remove("loading");
  }
}

function getWebsiteIconElement() {
  const websiteIconElement = document.createElement("img");
  websiteIconElement.src = "assets/icons/www-16.png";
  websiteIconElement.alt = "Website Icon";
  return websiteIconElement;
}

function getSpanElement(text) {
  const spanElement = document.createElement("span");
  spanElement.textContent = text;
  spanElement.title = text;
  return spanElement;
}

function getWebsiteLinkElement(websiteData) {
  const websiteLinkElement = document.createElement("a");
  websiteLinkElement.href = websiteData;
  websiteLinkElement.target = "_blank";
  return websiteLinkElement;
}

function getEditWebsiteDomainElement() {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("edit-website-domain-wrapper");

  const editWebsiteElement = document.createElement("img");
  editWebsiteElement.classList.add("edit-website-domain-icon");
  editWebsiteElement.src = "assets/icons/edit-website-domain-16.png";
  editWebsiteElement.alt = "Edit website domain";
  editWebsiteElement.title = "Edit website domain";

  wrapperDiv.appendChild(editWebsiteElement);
  wrapperDiv._icon = editWebsiteElement;

  return wrapperDiv;
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
        action: "fetchSalesNavigatorCompanyPage",
        url: companylink,
      });

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

function editWebsiteDomain(element, controlEditElement, { onSave } = {}) {
  if (!(element instanceof HTMLElement)) return;

  const iconElement = controlEditElement._icon;
  const previousValueKey = "data-previous-value";
  const isEditingKey = "data-is-editing";

  const Icons = {
    edit: {
      src: "assets/icons/edit-website-domain-16.png",
      alt: "Edit website domain",
      title: "Edit website domain",
    },
    save: {
      src: "assets/icons/save-website-domain-icon-16.png",
      alt: "Save domain",
      title: "Save domain",
    },
  };

  const updateIcon = (type) => {
    const icon = Icons[type];
    if (!icon) return;
    iconElement.src = icon.src;
    iconElement.alt = icon.alt;
    iconElement.title = icon.title;
  };

  const isEditing = () => element.getAttribute(isEditingKey) === "true";

  const startEditing = () => {
    if (isEditing()) return;
    element.setAttribute(previousValueKey, element.textContent.trim());
    element.setAttribute(isEditingKey, "true");
    element.setAttribute("spellcheck", "false");
    element.contentEditable = "true";
    element.classList.add("editing-domain");
    updateIcon("save");
    element.focus();
    document.addEventListener("click", handleDocumentClick);
  };

  const stopEditing = (shouldSave = true) => {
    if (!isEditing()) return;

    const previousValue = element.getAttribute(previousValueKey);
    const newValue = element.textContent.trim();

    element.contentEditable = "false";
    element.classList.remove("editing-domain");
    element.removeAttribute(isEditingKey);
    updateIcon("edit");
    element.title = newValue;

    if (shouldSave) {
      if (!newValue) {
        element.textContent = previousValue;
        element.title = previousValue;
        return;
      }

      if (newValue !== previousValue && typeof onSave === "function") {
        onSave(newValue);
      }
    } else {
      element.textContent = previousValue;
      element.title = previousValue;
    }
    document.removeEventListener("click", handleDocumentClick);
  };

  const finishEditing = () => stopEditing(true);
  const cancelEditing = () => stopEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain");

    const selection = window.getSelection(); // Get the current selection/cursor position
    if (!selection.rangeCount) return; // Exit if there's no active selection

    const range = selection.getRangeAt(0); // Get the active selection range
    range.deleteContents(); // Delete the selected content

    const textNode = document.createTextNode(text); // Create a text node from the pasted text
    range.insertNode(textNode); // Insert the text node at the current position

    // Set the cursor immediately after the inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleControlClick = () => {
    isEditing() ? finishEditing() : startEditing();
  };

  const handleDocumentClick = (e) => {
    if (
      isEditing() &&
      !element.contains(e.target) &&
      !controlEditElement.contains(e.target)
    ) {
      cancelEditing();
    }
  };

  controlEditElement.addEventListener("click", handleControlClick);
  element.addEventListener("keydown", handleKeyDown);
  element.addEventListener("paste", handlePaste);
}
