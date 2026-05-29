import {
  getCompanyItemElements,
  getEmailElement,
  getGenerateEmailsBtnElement,
  getCompanyIndustryElement,
  getCompanyCountryElement,
} from "../../helper/dom-helper.js";
import { updateSaveBtnState } from "../data/storage-actions.js";
import { getBasicEmail, fillEmailFromCache } from "../../services/email.js";
import { addCopyByClick, setValidationStyle } from "../../helper/dom-action.js";
import { showAlert } from "../../output/alert.js";
import { extractCountry } from "../filters/company-location.js";
import { getDefaultCountry } from "../settings/country-by-default.js";
import {
  getCompanyData,
  getWebsiteState,
  formatCompanySize,
  isValidDomain,
  getHostName,
  clearCompanyCache,
} from "../../services/company-data.js";
import {
  editWebsiteDomain,
  getEditWebsiteDomainElement,
} from "../../features/website-domain-editor.js";

export function handlerCompanyDetails() {
  initCompanyDetails();
  addCompanyDetailsListeners();
}

export async function refreshCompanyDetails(item) {
  const companyLinkElement = item.querySelector("a");
  if (companyLinkElement) {
    clearCompanyCache(companyLinkElement.href);
  }

  const websiteBlock = item.querySelector(".company-website");
  websiteBlock.removeAttribute("data-initialized");

  item.setAttribute("data-company-location", item.getAttribute("data-company-location-init"));
  item.setAttribute("data-company-industry", item.getAttribute("data-company-industry-init"));
  item.setAttribute("data-company-size", item.getAttribute("data-company-size-init"));

  await manageCompanyDetailsBlock(item);
  fillEmailFromCache(getEmailElement().value);
}

function addCompanyDetailsListeners() {
  getCompanyItemElements().forEach((item) => {
    item.querySelector(".company-header").addEventListener("click", async () => {
      await manageCompanyDetailsBlock(item);
      fillEmailFromCache(getEmailElement().value);
    });
  });
}

function initCompanyDetails() {
  getCompanyItemElements().forEach((item) => {
    if (item.classList.contains("active") && item.style.display !== "none") {
      manageCompanyDetailsBlock(item);
    }
  });
}

async function manageCompanyDetailsBlock(item) {
  let location = item.getAttribute("data-company-location");
  let industry = item.getAttribute("data-company-industry");
  let size = item.getAttribute("data-company-size");

  const websiteBlock = item.querySelector(".company-website");
  const locationBlock = item.querySelector(".company-location");
  const industryBlock = item.querySelector(".company-industry");
  const sizeBlock = item.querySelector(".company-size");
  const membersBlock = item.querySelector(".company-members");
  const companyLinkElement = item.querySelector("a");

  if (websiteBlock.getAttribute("data-initialized") === "true") {
    getGenerateEmailsBtnElement().disabled = !isValidDomain(
      websiteBlock.querySelector("span")?.textContent,
    );
    return;
  }

  getGenerateEmailsBtnElement().disabled = true;
  showLoadingState({ websiteBlock, locationBlock, industryBlock, sizeBlock, membersBlock, location, industry, size });

  const websiteIconElement = createWebsiteIconElement();
  const editDomainElement = getEditWebsiteDomainElement();

  websiteBlock.appendChild(websiteIconElement);
  websiteBlock.appendChild(createSpanElement("Loading website"));

  let companyDetails;

  try {
    companyDetails = companyLinkElement
      ? await getCompanyData(companyLinkElement.href, location, industry, size)
      : { website: "", location: "", industry: "", size: "", members: "", ok: false, completeRequest: true };

    clearLoadingState({ websiteBlock, locationBlock, industryBlock, sizeBlock, membersBlock });

    const website = renderWebsite(websiteBlock, websiteIconElement, companyDetails);
    location = renderLocation(locationBlock, item, companyDetails, location);
    industry = renderIndustry(industryBlock, item, companyDetails, industry);
    size = renderSize(sizeBlock, item, companyDetails, size);
    renderMembers(membersBlock, companyDetails);

    websiteBlock.appendChild(createSpanElement(website));
    websiteBlock.appendChild(editDomainElement);

    const isActiveAndVisible = item.classList.contains("active") && item.style.display !== "none";

    if (isActiveAndVisible) {
      getGenerateEmailsBtnElement().disabled = !isValidDomain(website);

      if (location !== "No location found") {
        getCompanyCountryElement().value = extractCountry(location) || getDefaultCountry();
      }
      if (industry !== "No industry found") {
        getCompanyIndustryElement().value = industry;
      }
    }

    const websiteSpan = websiteBlock.querySelector("span");
    editWebsiteDomain(websiteSpan, editDomainElement, {
      onSave: async (newValue) => {
        await handleDomainSave(newValue, websiteBlock, item);
      },
    });
  } catch (error) {
    websiteBlock.innerHTML = "Error loading website.";
    console.error("Error fetching website:", error);
  } finally {
    if (companyDetails?.completeRequest) {
      websiteBlock.setAttribute("data-initialized", "true");
    }
    removeLoadingState({ websiteBlock, locationBlock, industryBlock, sizeBlock, membersBlock });
    updateSaveBtnState();
  }
}

async function handleDomainSave(newValue, websiteBlock, item) {
  const valid = isValidDomain(newValue);
  const fullUrl = newValue.includes("://") ? newValue : `https://${newValue}`;

  const iconImg = websiteBlock.querySelector("img");
  const existingLink = websiteBlock.querySelector("a");

  if (valid) {
    if (existingLink) {
      existingLink.href = fullUrl;
    } else if (iconImg) {
      const linkEl = createWebsiteLinkElement(fullUrl);
      iconImg.replaceWith(linkEl);
      linkEl.appendChild(iconImg);
    }
    iconImg?.classList.remove("disabled");
  } else {
    if (existingLink) existingLink.removeAttribute("href");
    iconImg?.classList.add("disabled");
  }

  addCopyByClick(websiteBlock, "span", getBasicEmail.bind(null, newValue), "basic email");

  if (item.classList.contains("active")) {
    getGenerateEmailsBtnElement().disabled = !valid;
  }

  websiteBlock.classList.remove("valid", "no-valid");

  if (!valid) {
    showAlert("Invalid domain format.", "error");
    setValidationStyle(websiteBlock, false);
  } else {
    const state = await getWebsiteState(fullUrl);
    setValidationStyle(websiteBlock, state.ok);
  }
}

function renderWebsite(websiteBlock, websiteIconElement, companyDetails) {
  const fallback = companyDetails.completeRequest ? "No website found" : "";

  if (companyDetails.website) {
    const hostname = getHostName(companyDetails.website);
    const linkEl = createWebsiteLinkElement(companyDetails.website);
    websiteIconElement.classList.remove("disabled");
    linkEl.appendChild(websiteIconElement);
    websiteBlock.appendChild(linkEl);
    addCopyByClick(websiteBlock, "span", getBasicEmail.bind(null, hostname), "basic email");
    setValidationStyle(websiteBlock, companyDetails.ok);
    return hostname;
  }

  websiteIconElement.classList.add("disabled");
  websiteBlock.appendChild(websiteIconElement);
  return fallback;
}

function renderLocation(locationBlock, item, companyDetails, prevLocation) {
  const noFound = "No location found";
  let location = prevLocation;

  if (!prevLocation || prevLocation !== companyDetails.location) {
    location =
      companyDetails.location === "" && companyDetails.completeRequest
        ? noFound
        : companyDetails.location;
    item.setAttribute("data-company-location", companyDetails.location);
  }

  if (location === noFound) {
    const defaultCountry = getDefaultCountry();
    if (defaultCountry) location = defaultCountry;
  }

  locationBlock.appendChild(createSpanElement(location));
  return location;
}

function renderIndustry(industryBlock, item, companyDetails, prevIndustry) {
  const noFound = "No industry found";
  let industry = prevIndustry;

  if (!prevIndustry || prevIndustry !== companyDetails.industry) {
    industry =
      companyDetails.industry === "" && companyDetails.completeRequest
        ? noFound
        : companyDetails.industry;
    item.setAttribute("data-company-industry", companyDetails.industry);
  }

  industryBlock.appendChild(createSpanElement(industry));
  return industry;
}

function renderSize(sizeBlock, item, companyDetails, prevSize) {
  let size = prevSize;

  if (size === "unknown") {
    size = companyDetails.completeRequest
      ? formatCompanySize(companyDetails.size)
      : "";
    item.setAttribute("data-company-size", size);
  }

  sizeBlock.appendChild(createSpanElement(size));
  return size;
}

function renderMembers(membersBlock, companyDetails) {
  const value = companyDetails.members
    ? Number(companyDetails.members).toLocaleString()
    : "unknown";
  membersBlock.appendChild(createSpanElement(value));
}

function showLoadingState({ websiteBlock, locationBlock, industryBlock, sizeBlock, membersBlock, location, industry, size }) {
  websiteBlock.innerHTML = "";
  websiteBlock.classList.add("loading");

  if (!location) {
    locationBlock.innerHTML = "";
    locationBlock.classList.add("loading");
    locationBlock.appendChild(createSpanElement("Loading"));
  }
  if (!industry) {
    industryBlock.innerHTML = "";
    industryBlock.classList.add("loading");
    industryBlock.appendChild(createSpanElement("Loading"));
  }
  if (!size || size === "unknown") {
    sizeBlock.innerHTML = "";
    sizeBlock.classList.add("loading");
    sizeBlock.appendChild(createSpanElement("Loading"));
  }
  membersBlock.innerHTML = "";
  membersBlock.classList.add("loading");
  membersBlock.appendChild(createSpanElement("Loading"));
}

function clearLoadingState({ websiteBlock, locationBlock, industryBlock, sizeBlock, membersBlock }) {
  websiteBlock.innerHTML = "";
  locationBlock.innerHTML = "";
  industryBlock.innerHTML = "";
  sizeBlock.innerHTML = "";
  membersBlock.innerHTML = "";
}

function removeLoadingState({ websiteBlock, locationBlock, industryBlock, sizeBlock, membersBlock }) {
  websiteBlock.classList.remove("loading");
  locationBlock.classList.remove("loading");
  industryBlock.classList.remove("loading");
  sizeBlock.classList.remove("loading");
  membersBlock.classList.remove("loading");
}

function createWebsiteIconElement() {
  const img = document.createElement("img");
  img.src = "assets/icons/www-16.png";
  img.alt = "Website Icon";
  img.classList.add("disabled");
  return img;
}

function createSpanElement(text) {
  const span = document.createElement("span");
  span.textContent = text;
  span.title = text;
  return span;
}

function createWebsiteLinkElement(url) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  return a;
}
