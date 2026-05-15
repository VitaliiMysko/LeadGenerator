import {
  getCompanyItemElements,
  emailElement,
  generateEmailsBtnElement,
  companyIndustryElement,
  companyCountryElement,
} from "../../helper/dom-helper.js";
import { getBasicEmail, fillEmailFromCache } from "../../services/email.js";
import {
  addCopyByClick,
  setValidationStyle,
  useTextChangeEffect,
} from "../../helper/dom-action.js";

const companyDetailsByDefault = {
  website: "",
  location: "",
  industry: "",
  size: "",
  status: 0,
  ok: false,
  completeRequest: true,
};

export async function handlerCompanyDetails() {
  await initCompanyDetails();
  await addCompanyDetailsListener();
}

export async function refreshCompanyDetails(item) {
  const companyLinkElement = item.querySelector("a");
  if (companyLinkElement) {
    companyDetailsCache.delete(companyLinkElement.href);
  }

  const websiteBlock = item.querySelector(".company-website");
  websiteBlock.removeAttribute("data-initialized");

  const locationInitValue = item.getAttribute("data-company-location-init");
  const industryInitValue = item.getAttribute("data-company-industry-init");
  const sizeInitValue = item.getAttribute("data-company-size-init");

  item.setAttribute("data-company-location", locationInitValue);
  item.setAttribute("data-company-industry", industryInitValue);
  item.setAttribute("data-company-size", sizeInitValue);

  await manageCompanyDetailsBlock(item);
  fillEmailFromCache(emailElement.value);
}

async function addCompanyDetailsListener() {
  getCompanyItemElements().forEach(async (item) => {
    const header = item.querySelector(".company-header");
    header.addEventListener("click", async () => {
      await manageCompanyDetailsBlock(item);
      const pastedEmailWhileFindingWebsite = emailElement.value;
      fillEmailFromCache(pastedEmailWhileFindingWebsite);
    });
  });
}

async function initCompanyDetails() {
  getCompanyItemElements().forEach(async (item) => {
    if (item.classList.contains("active")) {
      if (item.style.display === "none") return;
      await manageCompanyDetailsBlock(item);
    }
  });
}

async function manageCompanyDetailsBlock(item) {
  let location = item.getAttribute("data-company-location");
  let industry = item.getAttribute("data-company-industry");
  let size = item.getAttribute("data-company-size");

  const companyNameLabel = item.querySelector(".company-name");

  const websiteBlock = item.querySelector(".company-website");
  const locationBlock = item.querySelector(".company-location");
  const industryBlock = item.querySelector(".company-industry");
  const sizeBlock = item.querySelector(".company-size");

  const companyLinkElement = item.querySelector("a");

  if (websiteBlock.getAttribute("data-initialized") === "true") {
    const websiteText = websiteBlock.querySelector("span")?.textContent;
    generateEmailsBtnElement.disabled = !isValidDomain(websiteText);
    return;
  } else {
    generateEmailsBtnElement.disabled = true;
  }

  websiteBlock.innerHTML = "";
  websiteBlock.classList.add("loading");

  if (!location) {
    locationBlock.innerHTML = "";
    locationBlock.classList.add("loading");
  }
  if (!industry) {
    industryBlock.innerHTML = "";
    industryBlock.classList.add("loading");
  }
  if (!size || size === "unknown") {
    sizeBlock.innerHTML = "";
    sizeBlock.classList.add("loading");
  }

  const websiteIconElement = getWebsiteIconElement();
  const editWebsiteDomainElement = getEditWebsiteDomainElement();
  const websiteLoadingTextElement = getSpanElement("Loading website");

  websiteBlock.appendChild(websiteIconElement);
  websiteBlock.appendChild(websiteLoadingTextElement);

  if (!location) {
    const countryLoadingTextElement = getSpanElement("Loading country");
    locationBlock.appendChild(countryLoadingTextElement);
  }
  if (!industry) {
    const industryLoadingTextElement = getSpanElement("Loading industry");
    industryBlock.appendChild(industryLoadingTextElement);
  }
  if (!size || size === "unknown") {
    const sizeLoadingTextElement = getSpanElement("Loading company size");
    sizeBlock.appendChild(sizeLoadingTextElement);
  }

  let companyDetails;

  try {
    companyDetails = companyLinkElement
      ? await getCompanyData(companyLinkElement.href, location, industry, size)
      : { ...companyDetailsByDefault };

    websiteBlock.innerHTML = "";
    locationBlock.innerHTML = "";
    industryBlock.innerHTML = "";
    sizeBlock.innerHTML = "";

    let website = "No website found";
    if (companyDetails.website) {
      const websiteLinkElement = getWebsiteLinkElement(companyDetails.website);
      websiteLinkElement.appendChild(websiteIconElement);
      websiteBlock.appendChild(websiteLinkElement);
      website = getHostName(companyDetails.website);
      const basicEmail = getBasicEmail.bind(null, website);
      addCopyByClick(websiteBlock, "span", basicEmail, "basic email");
      setValidationStyle(websiteBlock, companyDetails.ok);
    } else {
      website = companyDetails.completeRequest
        ? website
        : companyDetails.website;
      websiteBlock.appendChild(websiteIconElement);
    }

    const locationNoFound = "No location found";
    if (!location || location !== companyDetails.location) {
      location =
        companyDetails.location === "" && companyDetails.completeRequest
          ? locationNoFound
          : companyDetails.location;
      item.setAttribute(`data-company-location`, companyDetails.location);
    }

    const locationTextElement = getSpanElement(location);
    locationBlock.appendChild(locationTextElement);

    if (
      item.classList.contains("active") &&
      location !== locationNoFound &&
      item.style.display !== "none"
    ) {
      companyCountryElement.value = location.split(", ").pop();
    }

    const industryNoFound = "No industry found";
    if (!industry || industry !== companyDetails.industry) {
      industry =
        companyDetails.industry === "" && companyDetails.completeRequest
          ? industryNoFound
          : companyDetails.industry;
      item.setAttribute(`data-company-industry`, companyDetails.industry);
    }

    const industryTextElement = getSpanElement(industry);
    industryBlock.appendChild(industryTextElement);

    if (
      item.classList.contains("active") &&
      industry !== industryNoFound &&
      item.style.display !== "none"
    ) {
      companyIndustryElement.value = industry;
    }

    if (size === "unknown") {
      size = companyDetails.completeRequest
        ? formatCompanySize(companyDetails.size)
        : "";
      item.setAttribute(`data-company-size`, size);
    }

    const sizeTextElement = getSpanElement(size);
    sizeBlock.appendChild(sizeTextElement);

    const websiteElement = getSpanElement(website);
    websiteBlock.appendChild(websiteElement);
    websiteBlock.appendChild(editWebsiteDomainElement);

    if (item.classList.contains("active")) {
      generateEmailsBtnElement.disabled = !isValidDomain(website);
    }

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
    if (companyDetails.completeRequest) {
      websiteBlock.setAttribute("data-initialized", "true");
    }
    websiteBlock.classList.remove("loading");
    locationBlock.classList.remove("loading");
    industryBlock.classList.remove("loading");
    sizeBlock.classList.remove("loading");
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

function isValidDomain(value) {
  return /^[\w.-]+\.[a-zA-Z]{2,}$/.test(value?.trim());
}

function getHostName(url) {
  const fullUrl = url.includes("://") ? url : `http://${url}`;

  try {
    const hostname = new URL(fullUrl).hostname;
    const cleanHostname = hostname.replace(/^www\./, "");

    return cleanHostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
}

export function formatCompanySize(size) {
  if (!size) return "unknown";

  size = size
    .toLowerCase()
    .replace(/employees?/g, "")
    .replace(/\+/g, "")
    .trim();

  if (size === "myself only") return "0-1";

  if (size.includes("-")) return size;

  if (size.includes("k")) {
    size = size.replace("k", "");
    size = parseFloat(size) * 1000 + 1;
  } else {
    size = parseInt(size, 10);
  }

  if (isNaN(size)) return "unknown";

  if (size <= 1) return "0-1";
  if (size <= 10) return "2-10";
  if (size <= 50) return "11-50";
  if (size <= 200) return "51-200";
  if (size <= 500) return "201-500";
  if (size <= 1000) return "501-1000";
  if (size <= 5000) return "1001-5000";
  if (size <= 10000) return "5001-10000";

  return "10000+";
}

let currentRequestId = 0;
const companyDetailsCache = new Map();

async function getCompanyData(companylink, location, industry, size) {
  if (companyDetailsCache.has(companylink)) {
    return companyDetailsCache.get(companylink);
  }

  let companyDetails = { ...companyDetailsByDefault };
  companyDetails.location = location;
  companyDetails.industry = industry;
  companyDetails.size = size;
  if (companylink) {
    const requestId = ++currentRequestId;
    try {
      const response = await sendMessagePromise({
        action: "fetchSalesNavigatorCompanyPage",
        url: companylink,
        location: location,
        industry: industry,
        size: size === "unknown" ? "" : size,
      });

      if (response) {
        companyDetails.location = response.location;
        companyDetails.industry = response.industry;
        companyDetails.size = response.size;
        companyDetails.website = response.website;

        const websiteState = await getWebsiteState(response.website);
        companyDetails.status = websiteState.status;
        companyDetails.ok = websiteState.ok;
      } else {
        if (requestId !== currentRequestId) {
          companyDetails.completeRequest = false;
          return companyDetails;
        }
      }
    } catch (error) {
      console.error("Error fetching company details data:", error);
    }
  }
  companyDetailsCache.set(companylink, companyDetails);
  return companyDetails;
}

async function getWebsiteState(url) {
  if (!url) {
    return resolve({ status: 0, ok: false });
  }

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const manifest = chrome.runtime.getManifest();
  const worker = manifest.host_permissions[3];

  const workerUrl = `${worker}?url=${encodeURIComponent(url)}`;
  const response = await fetch(workerUrl);
  return await response.json();
}

function sendMessagePromise(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
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
  };

  const updateIcon = () => {
    iconElement.src = Icons.edit.src;
    iconElement.alt = Icons.edit.alt;
    iconElement.title = Icons.edit.title;
  };

  const isEditing = () => element.getAttribute(isEditingKey) === "true";

  const startEditing = () => {
    if (isEditing()) return;
    element.setAttribute(previousValueKey, element.textContent.trim());
    element.setAttribute(isEditingKey, "true");
    element.setAttribute("spellcheck", "false");
    element.contentEditable = "true";
    element.classList.add("editing-domain");
    element.focus();

    controlEditElement.style.display = "none";

    document.addEventListener("click", handleDocumentClick);
  };

  const stopEditing = (shouldSave = true) => {
    if (!isEditing()) return;

    const previousValue = element.getAttribute(previousValueKey);
    const newValue = element.textContent.trim();

    element.contentEditable = "false";
    element.classList.remove("editing-domain");
    element.removeAttribute(isEditingKey);
    updateIcon();
    element.title = newValue;

    controlEditElement.style.display = "inline-flex";

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

    useTextChangeEffect(element);

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
    document.execCommand("insertText", false, text);
  };

  const handleControlClick = () => {
    if (!isEditing()) startEditing();
  };

  const handleDocumentClick = (e) => {
    if (
      isEditing() &&
      !element.contains(e.target) &&
      !controlEditElement.contains(e.target)
    ) {
      finishEditing();
    }
  };

  controlEditElement.addEventListener("click", handleControlClick);
  element.addEventListener("keydown", handleKeyDown);
  element.addEventListener("paste", handlePaste);
}
