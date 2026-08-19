import { getWorkerUrl } from "../../constants/config.js";
import { extractCompanyId } from "../../utils/company-id.js";
import {
  getCachedCompany,
  setCachedCompany,
  removeCachedCompany,
  updateCachedCompanyWebsite,
} from "../store/company-cache-store.js";

const companyDetailsByDefault = {
  website: "",
  location: "",
  industry: "",
  size: "",
  members: "",
  status: 0,
  ok: false,
  completeRequest: true,
};

const popupSessionId = crypto.randomUUID();

let currentRequestId = 0;
const companyDetailsCache = new Map();

export async function clearCompanyCache(companyLink) {
  companyDetailsCache.delete(companyLink);

  const companyId = extractCompanyId(companyLink);
  if (companyId) {
    try {
      await removeCachedCompany(companyId);
    } catch (error) {
      console.error("Error clearing cached company data:", error);
    }
  }
}

export async function updateCompanyWebsite(companyLink, companyName, website) {
  const cacheKey = companyLink || companyName;
  const companyId = extractCompanyId(companyLink);

  if (cacheKey && companyDetailsCache.has(cacheKey)) {
    companyDetailsCache.set(cacheKey, { ...companyDetailsCache.get(cacheKey), website });
  }

  if (!companyId && !companyName) return;

  try {
    await updateCachedCompanyWebsite(companyId, companyName, website);
  } catch (error) {
    console.error("Error updating cached company website:", error);
  }
}

export async function getCompanyData(companyLink, location, industry, size, companyName) {
  const cacheKey = companyLink || companyName;

  if (cacheKey && companyDetailsCache.has(cacheKey)) {
    return companyDetailsCache.get(cacheKey);
  }

  const companyId = extractCompanyId(companyLink);
  const cachedDetails = await getCachedCompany(companyId, companyName);
  if (cachedDetails) {
    if (cacheKey) companyDetailsCache.set(cacheKey, cachedDetails);
    return cachedDetails;
  }

  const companyDetails = {
    ...companyDetailsByDefault,
    location,
    industry,
    size,
    members: "",
  };

  if (companyLink) {
    const requestId = ++currentRequestId;
    const publicCompanyUrl = companyLink.replace("/sales/", "/");

    try {
      const response = await chrome.runtime.sendMessage({
        action: "fetchLinkedinCompanyPage",
        sessionId: popupSessionId,
        url: `${publicCompanyUrl}/about`,
        location,
        industry,
        size: size === "unknown" ? "" : size,
      }).catch(() => null);

      if (response) {
        companyDetails.location = response.location;
        companyDetails.industry = response.industry;
        companyDetails.size = response.size;
        companyDetails.members = response.members || "";
        companyDetails.website = response.website;

        const websiteState = await getWebsiteState(response.website);
        companyDetails.status = websiteState.status;
        companyDetails.ok = websiteState.ok;

        if (companyId) {
          await setCachedCompany(companyId, companyName, companyDetails);
        }
      } else if (requestId !== currentRequestId) {
        companyDetails.completeRequest = false;
        return companyDetails;
      }
    } catch (error) {
      console.error("Error fetching company details data:", error);
    }
  }

  if (cacheKey) companyDetailsCache.set(cacheKey, companyDetails);
  return companyDetails;
}

export async function getWebsiteState(url) {
  if (!url) return { status: 0, ok: false };

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const workerUrl = `${getWorkerUrl()}?url=${encodeURIComponent(fullUrl)}`;
  const response = await fetch(workerUrl);
  return response.json();
}

export function isValidDomain(value) {
  return /^[\w.-]+\.[a-zA-Z]{2,}$/.test(value?.trim());
}

export function getHostName(url) {
  const fullUrl = url.includes("://") ? url : `http://${url}`;
  try {
    return new URL(fullUrl).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatCompanySize(size) {
  if (!size) return "unknown";
  if (/myself only/i.test(size)) return "0-1";

  const rangeMatch = size.match(/(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)/);
  if (rangeMatch) {
    return `${rangeMatch[1].replace(/,/g, "")}-${rangeMatch[2].replace(/,/g, "")}`;
  }

  const plusMatch = size.match(/(\d[\d,]*)\s*\+/);
  if (plusMatch) {
    return `${plusMatch[1].replace(/,/g, "")}+`;
  }

  return "unknown";
}
