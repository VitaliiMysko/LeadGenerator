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

const emailCache = new Map();
let loadingInterval = null;

export function fillEmailFromCache() {
  const domain = getWebsiteDomain();
  let email = "";

  if (emailCache.has(domain)) {
    email = emailCache.get(domain);
  }
  showEmail(email);
}

generateEmailsBtnElement.addEventListener("click", async () => {
  const domain = getWebsiteDomain();
  let emailValue = "";

  if (emailCache.has(domain)) {
    emailValue = emailCache.get(domain);
    showEmail(emailValue);
    emailValue === "" ? showMessage(false) : showMessage(true);
    return;
  }
  if (domain === "") {
    emailCache.set(domain, emailValue);
    showEmail(emailValue);
    showMessage(false);
    return;
  }

  const emails = generateEmails(domain);
  let isValid = false;

  startLoadingEffect();

  for (const email of emails) {
    isValid = await new Promise((resolve) => {
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

    if (isValid) {
      emailValue = email;
      break;
    }
  }

  stopLoadingEffect();

  emailCache.set(domain, emailValue);

  showEmail(emailValue);
  showMessage(isValid);
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

function stopLoadingEffect(finalValue = "") {
  clearInterval(loadingInterval);
  emailElement.disabled = false;
}

function showEmail(email) {
  emailElement.value = email;
  useTextChangeEffect(emailElement);
}

function showMessage(isEmailValid) {
  if (isEmailValid) {
    showAlert("Email found!", "success");
  } else {
    showAlert("Email not found!", "error");
  }
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

  const rawFirst = parts[0];
  const first = rawFirst.length > 1 ? rawFirst : "";
  const lastParts = parts.slice(1);
  const last = lastParts.join(".");
  const initials = parts.some((p) => p.includes("-"))
    ? ""
    : parts.map((p) => p[0]).join("");
  const initialLastPart1 = last.length > 1 ? last[0] : "";
  const initialFirst = rawFirst[0];
  const firstNoHyphen = first.includes("-") ? first.split("-")[0] : "";
  const lastPart1 = lastParts[0] || "";
  const lastPart2 = lastParts[1] || "";

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
