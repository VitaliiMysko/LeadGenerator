import {
  getFirstNameElement,
  getSecondNameElement,
} from "../helper/dom-helper.js";
import { prepareEmailName, collectEmails } from "../../utils/email-utils.js";

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
