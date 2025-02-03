import {
  GetRadioButtonElements,
  GetCompanyWebsiteElements,
} from "../../helper/dom-helper.js";

export async function handlerCompanyWebsite() {
  await initCompanyWebsite();
  await addCompanyWebsiteListener();
}

async function addCompanyWebsiteListener() {
  GetRadioButtonElements().forEach(async (radio) => {
    radio.addEventListener("change", async () => {
      await manageWebsiteBlock(radio);
    });
  });
}

async function initCompanyWebsite() {
  GetRadioButtonElements().forEach(async (radio) => {
    if (radio.checked) {
      await manageWebsiteBlock(radio);
    }
  });
}

async function manageWebsiteBlock(radio) {
  GetCompanyWebsiteElements().forEach((site) => (site.style.display = "none"));

  const parentDiv = radio.closest(".radio-company");
  const websiteBlock = parentDiv.querySelector(".current-company-website");
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
    const websiteData = companyLinkElement
      ? await getCompanyWebSite(companyLinkElement.href)
      : "";

    websiteBlock.innerHTML = "";

    const websiteElement = websiteData
      ? getWebsiteLinkElement(websiteData)
      : getWebsiteSpanElement("No website found");

    websiteBlock.appendChild(websiteIconElement);
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
  websiteLinkElement.textContent = getSecondLevelDomain(websiteData);
  return websiteLinkElement;
}

function getSecondLevelDomain(url) {
  try {
    // get host from URL
    const hostname = new URL(url).hostname;
    const cleanHostname = hostname.replace(/^www\./, "");
    const parts = cleanHostname.split(".");

    if (parts.length > 2) {
      return parts.slice(-2).join(".");
    }

    return cleanHostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
}

const websiteCache = new Map();

async function getCompanyWebSite(companylink) {
  if (websiteCache.has(companylink)) {
    return websiteCache.get(companylink);
  }

  let webSite = "";
  if (companylink) {
    try {
      const response = await sendMessagePromise({
        action: "fetchPage",
        url: companylink,
      });

      if (response) {
        webSite = response;
        websiteCache.set(companylink, webSite);
      }
    } catch (error) {
      console.error("Error fetching website data:", error);
    }
  }
  return webSite;
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
