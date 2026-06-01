import {
  getFirstNameElement,
  getSecondNameElement,
} from "../helper/dom-helper.js";
import { emailTemplates } from "../helper/emails-generation.js";

export function getBasicEmail(hostName) {
  const emailName = prepareEmailName(getFullName());
  return `${emailName}@${hostName}`;
}

export function generateEmails(hostName) {
  if (hostName === "") return [];

  const emails = [];
  const fullName = getFullName();
  collectEmails(emails, hostName, fullName);

  const fullNameAlternative = getFullNameAlternative();
  if (fullName !== fullNameAlternative) {
    collectEmails(emails, hostName, fullNameAlternative);
  }

  return emails;
}

function getFullName() {
  return `${getFirstNameElement().getAttribute("data-first-name")} ${getSecondNameElement().getAttribute("data-second-name")}`;
}

function getFullNameAlternative() {
  return `${transliterate(getFirstNameElement().value)} ${transliterate(getSecondNameElement().value)}`;
}

function prepareEmailName(fullName) {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/(\S)\s+(\S)/g, "$1.$2")
    .replace(/^-+|-+$/g, "")
    .replace(/\s(?=[a-zA-Z]+$)/, ".")
    .replace(/\.$/, "");
}

function collectEmails(emails, hostName, fullName) {
  const emailName = prepareEmailName(fullName);
  const parts = emailName.split(".");

  if (parts.length === 1) {
    emails.push(`${emailName}@${hostName}`);
    return;
  }

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
