import {
  saveBtnElement,
  storageExportBtnElement,
  cleanBtnElement,
  emailElement,
  firstNameElement,
  secondNameElement,
  jobPositionElement,
  linkElement,
  companyNameElement,
  companyCountryElement,
  companyIndustryElement,
} from "../../helper/dom-helper.js";
import { showAlert } from "../../output/alert.js";

const STORAGE_KEY = "saved_leads";
const MAX_ITEMS = 99;

let currentCount = 0;

(async () => {
  const leads = await loadLeads();
  currentCount = leads.length;
  updateUI();
})();

emailElement.addEventListener("input", updateSaveBtnState);

saveBtnElement.addEventListener("click", async () => {
  const email = emailElement.value.trim();
  if (!email || currentCount >= MAX_ITEMS) return;

  const leads = await loadLeads();

  if (leads.some((lead) => lead.email.toLowerCase() === email.toLowerCase())) {
    showAlert("Already saved", "error");
    return;
  }

  leads.push(collectCurrentData());
  await saveLeads(leads);

  currentCount = leads.length;
  updateUI();
  showAlert("Saved", "success");
});

storageExportBtnElement.addEventListener("click", async () => {
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
  updateUI();
  showAlert("Cleared", "success");
});

function updateUI() {
  const pct = (currentCount / MAX_ITEMS) * 100;
  storageExportBtnElement.style.setProperty("--fill-pct", `${pct}%`);
  storageExportBtnElement.querySelector(".get-counter-current").textContent =
    currentCount;
  updateSaveBtnState();
}

function updateSaveBtnState() {
  const email = emailElement.value.trim();
  saveBtnElement.disabled = !email || currentCount >= MAX_ITEMS;
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

async function copyLeadsToClipboard(leads) {
  const rows = leads.map((lead) =>
    [
      lead.firstName,
      lead.surname,
      lead.jobPosition,
      lead.link,
      lead.email,
      lead.companyName,
      lead.country,
      lead.industry,
    ]
      .map((v) => v || "")
      .join("\t"),
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
