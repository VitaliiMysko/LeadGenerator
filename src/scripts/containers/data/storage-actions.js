import {
  getSaveBtnElement,
  getStorageLeadsBtnElement,
  getCleanBtnElement,
  getEmailElement,
  getFirstNameElement,
  getSecondNameElement,
  getJobPositionElement,
  getLinkElement,
  getCompanyNameElement,
  getCompanyCountryElement,
  getCompanyIndustryElement,
  getDataContainerElement,
} from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";
import { showConfirm } from "../../output/confirm.js";
import { MAX_SAVED_LEADS } from "../../../constants/config.js";
import { localGet, localSet } from "../../utils/chrome-storage.js";
import { isDuplicate } from "../../../utils/lead-utils.js";

const STORAGE_KEY = "saved_leads";

const INPUT_ID_TO_LEAD_KEY = {
  "first-name": "firstName",
  "second-name": "surname",
  "job-position": "jobPosition",
  "link": "link",
  "email": "email",
  "company-name": "companyName",
  "company-country": "country",
  "company-industry": "industry",
};

let currentCount = 0;

(async () => {
  const leads = await loadLeads();
  currentCount = leads.length;
  getStorageLeadsBtnElement().querySelector(".get-counter-max").textContent = MAX_SAVED_LEADS;
  updateUI();
})();

[
  getFirstNameElement,
  getSecondNameElement,
  getJobPositionElement,
  getLinkElement,
  getEmailElement,
  getCompanyNameElement,
  getCompanyCountryElement,
  getCompanyIndustryElement,
].forEach((getter) => getter().addEventListener("input", updateSaveBtnState));

getSaveBtnElement().addEventListener("click", async () => {
  if (isAllFieldsEmpty() || currentCount >= MAX_SAVED_LEADS) return;

  const leads = await loadLeads();
  const newLead = collectCurrentData();

  if (isDuplicate(leads, newLead)) {
    showAlert("Already saved", "error");
    return;
  }

  leads.push(newLead);
  await saveLeads(leads);

  currentCount = leads.length;
  updateUI(true);
  showAlert("Saved", "success");
});

getStorageLeadsBtnElement().addEventListener("click", async () => {
  const leads = await loadLeads();
  if (leads.length === 0) {
    showAlert("Nothing to copy", "error");
    return;
  }
  await copyLeadsToClipboard(leads);
});

getCleanBtnElement().addEventListener("click", async () => {
  if (!await showConfirm("Are you sure you want to clear all saved leads?")) return;
  await saveLeads([]);
  currentCount = 0;
  updateUI(true);
  showAlert("Cleared", "success");
});

function updateUI(animate = false) {
  const storageLeadsBtnElement = getStorageLeadsBtnElement();
  const pct = (currentCount / MAX_SAVED_LEADS) * 100;
  storageLeadsBtnElement.style.setProperty("--fill-pct", `${pct}%`);
  const counterEl = storageLeadsBtnElement.querySelector(".get-counter-current");
  counterEl.textContent = currentCount;
  if (animate) {
    counterEl.classList.remove("pop");
    void counterEl.offsetWidth;
    counterEl.classList.add("pop");
  }
  getCleanBtnElement().disabled = currentCount === 0;
  updateSaveBtnState();
}

function getInputElements() {
  return [
    getFirstNameElement(),
    getSecondNameElement(),
    getJobPositionElement(),
    getLinkElement(),
    getEmailElement(),
    getCompanyNameElement(),
    getCompanyCountryElement(),
    getCompanyIndustryElement(),
  ];
}

function isAllFieldsEmpty() {
  return getInputElements().every((el) => !el.value.trim());
}

export function updateSaveBtnState() {
  getSaveBtnElement().disabled = isAllFieldsEmpty() || currentCount >= MAX_SAVED_LEADS;
}

function collectCurrentData() {
  return {
    firstName: getFirstNameElement().value,
    surname: getSecondNameElement().value,
    jobPosition: getJobPositionElement().value,
    link: getLinkElement().value,
    email: getEmailElement().value.trim(),
    companyName: getCompanyNameElement().value,
    country: getCompanyCountryElement().value,
    industry: getCompanyIndustryElement().value,
  };
}

function getFieldOrder() {
  return Array.from(getDataContainerElement().querySelectorAll(".draggable-block"))
    .map((block) => block.querySelector("input")?.id)
    .filter((id) => id && INPUT_ID_TO_LEAD_KEY[id]);
}

async function copyLeadsToClipboard(leads) {
  const fieldOrder = getFieldOrder();
  const rows = leads.map((lead) =>
    fieldOrder.map((id) => lead[INPUT_ID_TO_LEAD_KEY[id]] || "").join("\t"),
  );

  await navigator.clipboard.writeText(rows.join("\n"));
  showAlert("Copied", "success");
}

async function loadLeads() {
  return localGet(STORAGE_KEY, []);
}

async function saveLeads(leads) {
  return localSet(STORAGE_KEY, leads);
}
