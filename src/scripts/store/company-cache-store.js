import { localGet, localSet } from "../utils/chrome-storage.js";
import { MAX_CACHED_COMPANIES } from "../../constants/config.js";
import {
  upsertCompanyCacheEntry,
  findCompanyCacheEntry,
  removeCompanyCacheEntry,
  updateCompanyCacheEntryWebsite,
} from "../../utils/company-cache.js";

const STORAGE_KEY = "cachedCompanies";

export async function getCachedCompany(companyId, companyName) {
  if (!companyId && !companyName) return undefined;
  const entries = await localGet(STORAGE_KEY, []);
  return findCompanyCacheEntry(entries, companyId, companyName);
}

export async function setCachedCompany(companyId, companyName, data) {
  if (!companyId) return;
  const entries = await localGet(STORAGE_KEY, []);
  const updated = upsertCompanyCacheEntry(entries, companyId, companyName, data, MAX_CACHED_COMPANIES);
  await localSet(STORAGE_KEY, updated);
}

export async function removeCachedCompany(companyId) {
  if (!companyId) return;
  const entries = await localGet(STORAGE_KEY, []);
  const updated = removeCompanyCacheEntry(entries, companyId);
  await localSet(STORAGE_KEY, updated);
}

export async function updateCachedCompanyWebsite(companyId, companyName, website) {
  if (!companyId && !companyName) return;
  const entries = await localGet(STORAGE_KEY, []);
  const updated = updateCompanyCacheEntryWebsite(entries, companyId, companyName, website);
  await localSet(STORAGE_KEY, updated);
}
