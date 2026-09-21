import {
  getEmailElement,
  getGenerateEmailsBtnElement,
  getValidateEmailsBtnElement,
  getCompanyDomainElement,
} from "../helper/dom-helper.js";
import {
  useTextChangeEffect,
  useValidationEffect,
} from "../helper/dom-action.js";
import { showAlert } from "../output/alert.js";
import {
  verifyEmail,
  parseVerifyResult,
  emailDataByDefault,
} from "./email-validator.js";
import { generateEmails } from "./email-generator.js";
import { NO_WEBSITE_FOUND_TEXT } from "../../constants/config.js";

const emailCache = new Map();
let loadingInterval = null;

export function fillEmailFromCache(pastedEmailWhileFindingWebsite) {
  const domain = getWebsiteDomain();
  const emailData = emailCache.get(domain) ?? { ...emailDataByDefault };
  showEmail(emailData.email || pastedEmailWhileFindingWebsite);
}

getGenerateEmailsBtnElement().addEventListener("click", async () => {
  const domain = getWebsiteDomain();

  if (emailCache.has(domain)) {
    const cached = emailCache.get(domain);
    showEmail(cached.email);
    showMessage(cached.message, cached.ok);
    return;
  }

  const emailData = { ...emailDataByDefault };

  if (domain === "") {
    emailCache.set(domain, emailData);
    showEmail(emailData.email);
    showMessage(emailData.message, emailData.ok);
    return;
  }

  startLoadingEffect();

  for (const email of generateEmails(domain)) {
    try {
      parseVerifyResult(await verifyEmail(email), emailData);
    } catch (error) {
      console.error("Email verification failed:", error);
    }

    if (emailData.ok) {
      emailData.email = email;
      break;
    }
    if (emailData.invalidDomain || emailData.error) break;
  }

  if (!(emailData.unknown || emailData.error)) {
    emailCache.set(domain, emailData);
  }

  stopLoadingEffect();
  showEmail(emailData.email);
  showMessage(emailData.message, emailData.ok);
});

getEmailElement().addEventListener("input", () => {
  const el = getEmailElement();
  getValidateEmailsBtnElement().disabled = !el.value.trim() || !el.checkValidity();
});

getValidateEmailsBtnElement().addEventListener("click", async () => {
  const emailElement = getEmailElement();
  const emailData = { ...emailDataByDefault };

  if (!emailElement.checkValidity()) {
    emailData.message = "Email is not correct";
  } else {
    emailElement.value = emailElement.value.toLocaleLowerCase();
    try {
      parseVerifyResult(await verifyEmail(emailElement.value), emailData);
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
  const emailElement = getEmailElement();
  emailElement.disabled = true;
  emailElement.classList.add("loading");
  let dots = "";
  emailElement.value = "Loading";
  loadingInterval = setInterval(() => {
    dots = dots.length < 3 ? dots + "." : "";
    getEmailElement().value = "Loading" + dots;
  }, 500);
}

function stopLoadingEffect() {
  const emailElement = getEmailElement();
  clearInterval(loadingInterval);
  emailElement.disabled = false;
  emailElement.classList.remove("loading");
}

function showEmail(email) {
  const emailElement = getEmailElement();
  emailElement.value = email;
  emailElement.dispatchEvent(new Event("input"));
  useTextChangeEffect(emailElement);
}

function showMessage(message, isEmailValid) {
  showAlert(message, isEmailValid ? "success" : "error");
}

function getWebsiteDomain() {
  const text = getCompanyDomainElement()?.textContent.trim();
  return text && text !== NO_WEBSITE_FOUND_TEXT ? text : "";
}
