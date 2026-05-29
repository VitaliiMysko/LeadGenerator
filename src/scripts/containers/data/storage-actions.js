import {
  saveBtnElement,
  storageLeadsBtnElement,
  cleanBtnElement,
  emailElement,
  firstNameElement,
  secondNameElement,
  jobPositionElement,
  linkElement,
  companyNameElement,
  companyCountryElement,
  companyIndustryElement,
  dataContainerElement,
} from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";
import { MAX_SAVED_LEADS } from "../../../constants/config.js";

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
  storageLeadsBtnElement.querySelector(".get-counter-max").textContent = MAX_SAVED_LEADS;
  updateUI();
})();

[
  firstNameElement,
  secondNameElement,
  jobPositionElement,
  linkElement,
  emailElement,
  companyNameElement,
  companyCountryElement,
  companyIndustryElement,
].forEach((el) => el.addEventListener("input", updateSaveBtnState));

saveBtnElement.addEventListener("click", async () => {
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

storageLeadsBtnElement.addEventListener("click", async () => {
  const leads = await loadLeads();
  if (leads.length === 0) {
    showAlert("Nothing to copy", "error");
    return;
  }
  await copyLeadsToClipboard(leads);
});

cleanBtnElement.addEventListener("click", async () => {
  await saveLeads([]);
  currentCount = 0;
  updateUI(true);
  showAlert("Cleared", "success");
});

function updateUI(animate = false) {
  const pct = (currentCount / MAX_SAVED_LEADS) * 100;
  storageLeadsBtnElement.style.setProperty("--fill-pct", `${pct}%`);
  const counterEl = storageLeadsBtnElement.querySelector(".get-counter-current");
  counterEl.textContent = currentCount;
  if (animate) {
    counterEl.classList.remove("pop");
    void counterEl.offsetWidth;
    counterEl.classList.add("pop");
  }
  updateSaveBtnState();
}

function isAllFieldsEmpty() {
  return [
    firstNameElement,
    secondNameElement,
    jobPositionElement,
    linkElement,
    emailElement,
    companyNameElement,
    companyCountryElement,
    companyIndustryElement,
  ].every((el) => !el.value.trim());
}

export function updateSaveBtnState() {
  saveBtnElement.disabled = isAllFieldsEmpty() || currentCount >= MAX_SAVED_LEADS;
}

function isDuplicate(leads, newLead) {
  return leads.some((lead) => {
    if (newLead.email) {
      return lead.email.toLowerCase() === newLead.email.toLowerCase();
    }
    return (
      !lead.email &&
      lead.firstName === newLead.firstName &&
      lead.surname === newLead.surname &&
      lead.jobPosition === newLead.jobPosition &&
      lead.link === newLead.link &&
      lead.companyName === newLead.companyName &&
      lead.country === newLead.country &&
      lead.industry === newLead.industry
    );
  });
}

function collectCurrentData() {
  return {
    firstName: firstNameElement.value,
    surname: secondNameElement.value,
    jobPosition: jobPositionElement.value,
    link: linkElement.value,
    email: emailElement.value.trim(),
    companyName: companyNameElement.value,
    country: companyCountryElement.value,
    industry: companyIndustryElement.value,
  };
}

function getFieldOrder() {
  return Array.from(dataContainerElement.querySelectorAll(".draggable-block"))
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
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
      resolve(data[STORAGE_KEY] || []);
    });
  });
}

async function saveLeads(leads) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: leads }, resolve);
  });
}
