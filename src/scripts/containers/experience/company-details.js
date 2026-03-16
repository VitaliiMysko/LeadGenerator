import {
  getRadioButtonElements,
  getCompanyNameElements,
  getCompanyJobElements,
  getCompanyWebsiteElements,
  getCompanyLocationElements,
  getCompanyIndustryElements,
  getCompanySizeElements,
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
};

export async function handlerCompanyDetails() {
  await initCompanyDetails();
  await addCompanyDetailsListener();
}

async function addCompanyDetailsListener() {
  getRadioButtonElements().forEach(async (radio) => {
    radio.addEventListener("change", async () => {
      await manageCompanyDetailsBlock(radio);
      const pastedEmailWhileFindingWebsite = emailElement.value;
      fillEmailFromCache(pastedEmailWhileFindingWebsite);
    });
  });
}

async function initCompanyDetails() {
  getRadioButtonElements().forEach(async (radio) => {
    if (radio.checked) {
      await manageCompanyDetailsBlock(radio);
    }
  });
}

async function manageCompanyDetailsBlock(radio) {
  getCompanyNameElements().forEach((label) => label.classList.remove("active"));
  getCompanyJobElements().forEach((job) => job.classList.remove("active"));
  getCompanyWebsiteElements().forEach((website) => {
    website.classList.remove("active");
    website.style.display = "none";
  });
  getCompanyLocationElements().forEach((country) => {
    country.classList.remove("active");
    country.style.display = "none";
  });
  getCompanyIndustryElements().forEach((industry) => {
    industry.classList.remove("active");
    industry.style.display = "none";
  });
  getCompanySizeElements().forEach((size) => {
    size.classList.remove("active");
    size.style.display = "none";
  });

  const parentDiv = radio.closest(".radio-company");

  let location = parentDiv.getAttribute("data-company-location");
  let industry = parentDiv.getAttribute("data-company-industry");
  let size = parentDiv.getAttribute("data-company-size");

  const companyNameLabel = parentDiv.querySelector(".company-name");
  companyNameLabel.classList.add("active");

  const companyJobElement = parentDiv.querySelector(".company-job");
  companyJobElement.classList.add("active");

  const websiteBlock = parentDiv.querySelector(".company-website");
  websiteBlock.classList.add("active");

  const locationBlock = parentDiv.querySelector(".company-location");
  locationBlock.classList.add("active");

  const industryBlock = parentDiv.querySelector(".company-industry");
  industryBlock.classList.add("active");

  const sizeBlock = parentDiv.querySelector(".company-size");
  sizeBlock.classList.add("active");

  const companyLinkElement = parentDiv.querySelector("a");

  websiteBlock.style.display = "flex";
  locationBlock.style.display = "flex";
  industryBlock.style.display = "flex";
  sizeBlock.style.display = "flex";

  const generateEmailIcon = generateEmailsBtnElement.querySelector("img");
  const generateEmailIconByDefaultSrc = "assets/icons/generate-emails-16.png";
  const generateEmailIconGreySrc = "assets/icons/generate-emails-grey-16.png";

  if (websiteBlock.getAttribute("data-initialized") === "true") {
    generateEmailsBtnElement.disabled = false;
    generateEmailIcon.src = generateEmailIconByDefaultSrc;
    return;
  } else {
    generateEmailsBtnElement.disabled = true;
    generateEmailIcon.src = generateEmailIconGreySrc;
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
  if (!size) {
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
  if (!size) {
    const sizeLoadingTextElement = getSpanElement("Loading company size");
    sizeBlock.appendChild(sizeLoadingTextElement);
  }

  try {
    let companyDetails = companyLinkElement
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
      websiteBlock.appendChild(websiteIconElement);
    }

    const locationNoFound = "No location found";
    if (!location || location !== companyDetails.location) {
      location =
        companyDetails.location === ""
          ? locationNoFound
          : companyDetails.location;
      parentDiv.setAttribute(`data-company-location`, companyDetails.location);
    }

    const locationTextElement = getSpanElement(location);
    locationBlock.appendChild(locationTextElement);

    if (radio.checked && location !== locationNoFound) {
      companyCountryElement.value = location.split(", ").pop();
    }

    const industryNoFound = "No industry found";
    if (!industry || industry !== companyDetails.industry) {
      industry =
        companyDetails.industry === ""
          ? industryNoFound
          : companyDetails.industry;
      parentDiv.setAttribute(`data-company-industry`, companyDetails.industry);
    }

    const industryTextElement = getSpanElement(industry);
    industryBlock.appendChild(industryTextElement);

    if (radio.checked && industry !== industryNoFound) {
      companyIndustryElement.value = industry;
    }

    const sizeNoFound = "No company size found";
    if (!size || size !== companyDetails.size) {
      size =
        companyDetails.size === ""
          ? sizeNoFound
          : companyDetails.size;
      parentDiv.setAttribute(`data-company-size`, companyDetails.size);
    }

    const sizeTextElement = getSpanElement(size);
    sizeBlock.appendChild(sizeTextElement);

    const websiteElement = getSpanElement(website);
    websiteBlock.appendChild(websiteElement);
    websiteBlock.appendChild(editWebsiteDomainElement);

    if (companyNameLabel.classList.contains("active")) {
      generateEmailsBtnElement.disabled = false;
      generateEmailIcon.src = generateEmailIconByDefaultSrc;
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
    websiteBlock.setAttribute("data-initialized", "true");
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
    try {
      const response = await sendMessagePromise({
        action: "fetchSalesNavigatorCompanyPage",
        url: companylink,
        location: location,
        industry: industry,
        size: size,
      });

      if (response) {
        companyDetails = response;
      }
    } catch (error) {
      console.error("Error fetching company details data:", error);
    }
  }
  companyDetailsCache.set(companylink, companyDetails);
  return companyDetails;
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
