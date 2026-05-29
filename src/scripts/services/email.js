import {
  getFirstNameElement,
  getSecondNameElement,
  generateEmailsBtnElement,
  validateEmailsBtnElement,
  getCompanyDomainElement,
  emailElement,
} from "../helper/dom-helper.js";
import { emailTemplates } from "../helper/emails-generation.js";
import {
  useTextChangeEffect,
  useValidationEffect,
} from "../helper/dom-action.js";
import { showAlert } from "../output/alert.js";

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

export function fillEmailFromCache(pastedEmailWhileFindingWebsite) {
  const domain = getWebsiteDomain();

  let emailData = { ...emailDataByDefault };

  if (emailCache.has(domain)) {
    emailData = emailCache.get(domain);
  }

  const email = emailData.email
    ? emailData.email
    : pastedEmailWhileFindingWebsite;
  showEmail(email);
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

  for (const email of emails) {
    try {
      const verifyEmailResult = await verifyEmailDirect(email);
      checkVerifyEmailResult(verifyEmailResult, emailData);
    } catch (error) {
      console.error("Email verification failed:", error);
    }

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

  stopLoadingEffect();

  showEmail(emailData.email);
  showMessage(emailData.message, emailData.ok);
});

emailElement.addEventListener("input", () => {
  validateEmailsBtnElement.disabled = !emailElement.value.trim() || !emailElement.checkValidity();
});

validateEmailsBtnElement.addEventListener("click", async () => {
  const emailData = { ...emailDataByDefault };

  if (!emailElement.checkValidity()) {
    emailData.message = "Email is not correct";
  } else {
    emailElement.value = emailElement.value.toLocaleLowerCase();
    try {
      const verifyEmailResult = await verifyEmailDirect(emailElement.value);
      checkVerifyEmailResult(verifyEmailResult, emailData);
    } catch (error) {
      console.error("Email verification failed:", error);
    }
  }

  showMessage(emailData.message, emailData.ok);
  useValidationEffect(emailElement, emailData.ok);
});

async function verifyEmailDirect(email) {
  const manifest = chrome.runtime.getManifest();
  const worker = manifest.host_permissions[2];
  const workerUrl = `${worker}?email=${encodeURIComponent(email)}`;

  let emailVerificationResponse;
  try {
    const response = await fetch(workerUrl);
    const result = await response.json();

    emailVerificationResponse = {
      state: result.state,
      reason: result.reason,
      error: "",
    };
  } catch (error) {
    console.error("Email verification failed:", error);
    emailVerificationResponse = {
      state: "",
      reason: "",
      error: error.message,
    };
  }
  return emailVerificationResponse;
}

function startLoadingEffect() {
  emailElement.disabled = true;
  emailElement.classList.add("loading");
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
  emailElement.classList.remove("loading");
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
  emailElement.dispatchEvent(new Event("input"));
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
    "data-first-name",
  )} ${getSecondNameElement().getAttribute("data-second-name")}`;
}

function getFullNameAlternative() {
  const firstNameAlternative = transliterate(getFirstNameElement().value);
  const secondNameAlternative = transliterate(getSecondNameElement().value);
  return `${firstNameAlternative} ${secondNameAlternative}`;
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

function getEmails(emails, hostName, fullName) {
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

  emailTemplates.forEach(({ template, condition }) => {
    if (condition(data)) {
      const email = template.replace(/{(\w+)}/g, (_, key) => data[key] || "");
      if (!emails.includes(email)) emails.push(email);
    }
  });
}

export const generateEmails = (hostName) => {
  const emails = [];
  if (hostName === "") return emails;

  const fullName = getFullName();
  getEmails(emails, hostName, fullName);

  const fullNameAlternative = getFullNameAlternative();
  if (fullName !== fullNameAlternative) {
    getEmails(emails, hostName, fullNameAlternative);
  }

  return emails;
};
