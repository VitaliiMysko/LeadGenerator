import { getWorkerUrl } from "../../constants/config.js";
import { extractCompanyId, getCompanyCacheKey } from "../../utils/company-id.js";
import { fetchWorkerJson } from "./worker-client.js";
import { formatCompanySize } from "../../utils/company-size.js";
import { isOpenJobsKnown } from "../../utils/open-jobs.js";
import { syncGet } from "../utils/chrome-storage.js";
import {
  getCachedCompany,
  setCachedCompany,
  removeCachedCompany,
  updateCachedCompanyWebsite,
  updateCachedCompanyOpenJobs,
} from "../store/company-cache-store.js";

const companyDetailsByDefault = {
  website: "",
  location: "",
  industry: "",
  size: "",
  members: "",
  openJobTitles: null,
  status: 0,
  ok: false,
  completeRequest: true,
};

const panelSessionId = crypto.randomUUID();

let currentRequestId = 0;
const companyDetailsCache = new Map();
// Lookups in progress, by company: a request for a company already being
// looked up (e.g. the next lead in people search works there too) waits for
// that lookup instead of starting another one, which would cancel it.
const pendingLookups = new Map();

export async function clearCompanyCache(companyLink) {
  companyDetailsCache.delete(getCompanyCacheKey(companyLink));

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
  const cacheKey = getCompanyCacheKey(companyLink, companyName);
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

export function getCompanyData(companyLink, location, industry, size, companyName) {
  const cacheKey = getCompanyCacheKey(companyLink, companyName);
  if (cacheKey && pendingLookups.has(cacheKey)) return pendingLookups.get(cacheKey);

  const lookup = lookUpCompanyData(companyLink, location, industry, size, companyName);
  if (!cacheKey) return lookup;

  pendingLookups.set(cacheKey, lookup);
  return lookup.finally(() => pendingLookups.delete(cacheKey));
}

async function lookUpCompanyData(companyLink, location, industry, size, companyName) {
  const companyDetails = await getCompanyDetails(companyLink, location, industry, size, companyName);

  if (
    !companyLink ||
    !companyDetails.completeRequest ||
    isOpenJobsKnown(companyDetails.openJobTitles) ||
    !(await syncGet("storeHasOpenJobsEnabled"))
  ) {
    return companyDetails;
  }

  return addOpenJobs(companyDetails, companyLink, companyName);
}

// Checked once per company and cached with its other details; the refresh
// button clears the cache, so it's checked again then.
async function addOpenJobs(companyDetails, companyLink, companyName) {
  const requestId = ++currentRequestId;

  const response = await chrome.runtime.sendMessage({
    action: "fetchLinkedinCompanyJobs",
    sessionId: panelSessionId,
    url: `${toPublicCompanyUrl(companyLink)}/jobs`,
  }).catch(() => null);

  if (!isOpenJobsKnown(response?.openJobTitles)) {
    // Superseded by a request for another company: report it as incomplete
    // so the check runs again when this company is selected next time.
    if (!response && requestId !== currentRequestId) {
      return { ...companyDetails, completeRequest: false };
    }
    return companyDetails;
  }

  const updatedDetails = { ...companyDetails, openJobTitles: response.openJobTitles };
  companyDetailsCache.set(getCompanyCacheKey(companyLink, companyName), updatedDetails);

  try {
    await updateCachedCompanyOpenJobs(extractCompanyId(companyLink), companyName, response.openJobTitles);
  } catch (error) {
    console.error("Error updating cached company open jobs:", error);
  }

  return updatedDetails;
}

function toPublicCompanyUrl(companyLink) {
  return companyLink.replace("/sales/", "/");
}

async function getCompanyDetails(companyLink, location, industry, size, companyName) {
  const cacheKey = getCompanyCacheKey(companyLink, companyName);

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
    const publicCompanyUrl = toPublicCompanyUrl(companyLink);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "fetchLinkedinCompanyPage",
        sessionId: panelSessionId,
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
  return fetchWorkerJson(workerUrl);
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

export { formatCompanySize };
