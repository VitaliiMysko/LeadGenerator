import { getWorkerUrl } from "../../constants/config.js";

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

let currentRequestId = 0;
const companyDetailsCache = new Map();

export function clearCompanyCache(companyLink) {
  companyDetailsCache.delete(companyLink);
}

export async function getCompanyData(companyLink, location, industry, size) {
  if (companyDetailsCache.has(companyLink)) {
    return companyDetailsCache.get(companyLink);
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
      } else if (requestId !== currentRequestId) {
        companyDetails.completeRequest = false;
        return companyDetails;
      }
    } catch (error) {
      console.error("Error fetching company details data:", error);
    }
  }

  companyDetailsCache.set(companyLink, companyDetails);
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
