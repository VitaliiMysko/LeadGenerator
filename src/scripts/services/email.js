import {
  getFirstNameElement,
  getSecondNameElement,
  generateEmailsElement,
  getCompanyDomainElement,
} from "../helper/dom-helper.js";
import { emailTemplates } from "../helper/emails-generation.js";

generateEmailsElement.addEventListener("click", () => {
  const domain = getWebsiteDomain();
  console.log(generateEmails(domain));
});

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
  const f = rawFirst[0];
  const firstNoHyphen = first.includes("-") ? first.split("-")[0] : "";
  const lastPart2 = lastParts[1] || "";

  const data = {
    first,
    last,
    initials,
    firstNoHyphen,
    f,
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
