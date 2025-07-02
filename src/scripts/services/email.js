import {
  getFirstNameElement,
  getSecondNameElement,
  generateEmailsBtnElement,
  getCompanyDomainElement,
  emailElement,
} from "../helper/dom-helper.js";
import { emailTemplates } from "../helper/emails-generation.js";

import { useTextChangeEffect } from "../helper/dom-action.js";
import { showAlert } from "../output/alert.js";

const manifest = chrome.runtime.getManifest();
const environment = manifest.environment;

const emailCache = new Map();
const emailDataByDefault = {
  email: "",
  message: "Email not found!",
  ok: false,
  error: false,
  invalidDomain: false,
  unknown: false,
};
let loadingInterval = null;

export function fillEmailFromCache() {
  const domain = getWebsiteDomain();

  let emailData = { ...emailDataByDefault };

  if (emailCache.has(domain)) {
    emailData = emailCache.get(domain);
  }
  showEmail(emailData.email);
}

generateEmailsBtnElement.addEventListener("click", async () => {
  const domain = getWebsiteDomain();

  if (emailCache.has(domain)) {
    const emailDataCache = emailCache.get(domain);
    showEmail(emailDataCache.email);
    showMessage(emailDataCache.message, emailDataCache.ok);
    return;
  }

  const emailData = { ...emailDataByDefault };

  if (domain === "") {
    emailCache.set(domain, emailData);
    showEmail(emailData.email);
    showMessage(emailData.message, emailData.ok);
    return;
  }

  const emails = generateEmails(domain);

  startLoadingEffect();

  const stateResults = [];

  for (const email of emails) {
    const verifyEmailResult = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          action: "verifyEmail",
          email: email,
        },
        (response) => {
          resolve(response);
        }
      );
    });
    
    checkVerifyEmailResult(verifyEmailResult, emailData);
    stateResults.push(verifyEmailResult);

    if (emailData.ok) {
      emailData.email = email;
      break;
    }

    if (emailData.invalidDomain || emailData.error) {
      break;
    }
  }

  if (!(emailData.unknown || emailData.error)) {
    emailCache.set(domain, emailData);
  }

  const emailsStates = stateResults.map((r) => r.state);

  stopLoadingEffect();

  if (
    environment === "local" &&
    !(
      emailData.ok ||
      emailData.unknown ||
      emailData.error ||
      emailData.invalidDomain
    )
  ) {
    showEmail("");
    showMessage(`Email statuses: ${emailsStates.join(", ")}`, false);
    return;
  }

  showEmail(emailData.email);
  showMessage(emailData.message, emailData.ok);
});

function startLoadingEffect() {
  emailElement.disabled = true;
  let dots = "";
  emailElement.value = "Loading";

  loadingInterval = setInterval(() => {
    dots = dots.length < 3 ? dots + "." : "";
    emailElement.value = "Loading" + dots;
  }, 500);
}

function stopLoadingEffect() {
  clearInterval(loadingInterval);
  emailElement.disabled = false;
}

function checkVerifyEmailResult(result, emailData) {
  if (result.state === "deliverable") {
    emailData.ok = true;
    emailData.message = "Email found";
  }
  if (result.state === "unknown") {
    emailData.unknown = true;
    emailData.message = "There are unknown emails. Please, recheck it later";
  }
  if (result.state === "undeliverable" && result.reason === "invalid_domain") {
    emailData.invalidDomain = true;
    emailData.message = "Email not found. Domain is invalid";
  }
  if (result.error !== "") {
    emailData.error = true;
    emailData.message = `Email verification failed: ${result.error}`;
  }
}

function showEmail(email) {
  emailElement.value = email;
  useTextChangeEffect(emailElement);
}

function showMessage(message, isEmailValid) {
  const state = isEmailValid ? "success" : "error";
  showAlert(message, state);
}

function getWebsiteDomain() {
  const domainElement = getCompanyDomainElement();
  const text = domainElement.textContent.trim();
  return text && text !== "No website found" ? text : "";
}

export const getBasicEmail = (hostName) => {
  const fullName = getFullName();
  const emailName = prepareBasicEmailName(fullName);
  return `${emailName}@${hostName}`;
};

function getFullName() {
  return `${getFirstNameElement().getAttribute(
    "data-first-name"
  )} ${getSecondNameElement().getAttribute("data-second-name")}}`;
}

function prepareBasicEmailName(fullName) {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/(\S)\s+(\S)/g, "$1.$2")
    .replace(/^-+|-+$/g, "")
    .replace(/\s(?=[a-zA-Z]+$)/, ".")
    .replace(/\.$/, "");
}

export const generateEmails = (hostName) => {
  const fullName = getFullName();
  const emailName = prepareBasicEmailName(fullName);
  const parts = emailName.split(".");

  if (parts.length === 1) return [`${emailName}@${hostName}`];

  const dutchSurnames = ["van", "de"];
  const rawFirst = parts[0];
  const first = rawFirst.length > 1 ? rawFirst : "";
  const lastParts = parts.slice(1);
  const last = lastParts.join(".");
  const initials =
    parts.length <= 3 && !parts.some((p) => p.includes("-"))
      ? parts.map((p) => p[0]).join("")
      : "";
  const initialLastPart1 = last.length > 1 ? last[0] : "";
  const initialFirst = rawFirst[0];
  const firstNoHyphen = first.includes("-") ? first.split("-")[0] : "";
  const lastPart1 =
    lastParts.length === 2 && dutchSurnames.includes(lastParts[0])
      ? lastParts[0]
      : "";
  const lastPart2 = lastParts.length === 2 ? lastParts[1] : "";

  const data = {
    first,
    last,
    initials,
    initialFirst,
    initialLastPart1,
    firstNoHyphen,
    lastPart1,
    lastPart2,
    host: hostName,
  };

  const emails = [];
  if (hostName === "") return emails;

  emailTemplates.forEach(({ template, condition }) => {
    if (condition(data)) {
      const email = template.replace(/{(\w+)}/g, (_, key) => data[key] || "");
      if (!emails.includes(email)) emails.push(email);
    }
  });

  return emails;
};
