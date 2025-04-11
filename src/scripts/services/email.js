import {
  getFirstNameElement,
  getSecondNameElement,
  generateEmailsElement,
  getCompanyDomainElement,
  emailElement,
} from "../helper/dom-helper.js";

import { useTextChangeEffect } from "../helper/dom-action.js";

generateEmailsElement.addEventListener("click", async () => {
  const domain = getWebsiteDomain();
  const emails = generateEmails(domain);

  for (const email of emails) {
    const isValid = await new Promise((resolve) => {
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

    if (isValid === true) {
      emailElement.value = email;
      useTextChangeEffect(emailElement);

      break;
    }
  }
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

  const [firstName, ...lastNames] = parts;
  const lastName = lastNames.join(".");
  const initials = parts.map((name) => name[0]).join("");

  const emails = [];
  if (hostName === "") return emails;

  if (
    parts.length === 2 &&
    firstName.length > 1 &&
    lastName.length > 1 &&
    !firstName.includes("-")
  ) {
    generateTwoWordsEmails(firstName, lastName, initials, hostName, emails);
  } else if (
    parts.length === 2 &&
    lastName.length > 1 &&
    firstName.includes("-")
  ) {
    generateTwoWordsAndHyphenatedFirstNameEmails(
      firstName,
      lastName,
      hostName,
      emails
    );
  } else if (parts.length === 3 && !firstName.includes("-")) {
    generateTwoWordsInLastNameEmails(
      firstName,
      lastName,
      initials,
      hostName,
      emails
    );
  } else if (parts.length === 3 && firstName.includes("-")) {
    generateTwoWordsInLastNameAndHyphenatedFirstName(
      firstName,
      lastName,
      hostName,
      emails
    );
  } else if (parts.length === 2 && firstName.length === 1) {
    generateAbbreviatedFirstNameEmails(
      firstName,
      lastName,
      initials,
      hostName,
      emails
    );
  } else if (parts.length === 2 && lastName.length === 1) {
    generateAbbreviatedLastNameEmails(firstName, initials, hostName, emails);
  } else {
    emails.push(`${emailName}@${hostName}`);
  }

  return emails;
};

const generateTwoWordsEmails = (
  firstName,
  lastName,
  initials,
  hostName,
  emails
) => {
  addCommonEmails(firstName, lastName, hostName, emails);
  addTwoWordsEmails(firstName, lastName, hostName, emails);
  addInitialsEmail(initials, hostName, emails);
  emails.push(`${firstName}${lastName}@${hostName}`);
  emails.push(`${firstName}_${lastName}@${hostName}`);
};

const generateTwoWordsAndHyphenatedFirstNameEmails = (
  firstName,
  lastName,
  hostName,
  emails
) => {
  const shortFirstName = firstName.split("-")[0];
  addCommonEmails(firstName, lastName, hostName, emails);
  emails.push(`${shortFirstName}.${lastName}@${hostName}`);
  addTwoWordsEmails(firstName, lastName, hostName, emails);
};

const generateTwoWordsInLastNameEmails = (
  firstName,
  lastName,
  initials,
  hostName,
  emails
) => {
  const lastWord = lastName.split(".").pop();
  const firstAndLastWordsInitials = firstName.charAt(0) + lastWord.charAt(0);
  addCommonEmails(firstName, lastName, hostName, emails);
  addInitialsEmail(initials, hostName, emails);
  addTwoWordsInLastNameEmails(firstName, lastWord, hostName, emails);
  emails.push(`${firstAndLastWordsInitials}@${hostName}`);
};

const generateTwoWordsInLastNameAndHyphenatedFirstName = (
  firstName,
  lastName,
  hostName,
  emails
) => {
  const shortFirstName = firstName.split("-")[0];
  const lastWord = lastName.split(".").pop();
  addCommonEmails(firstName, lastName, hostName, emails);
  addTwoWordsInLastNameEmails(firstName, lastWord, hostName, emails);
  emails.push(`${shortFirstName}.${lastWord}@${hostName}`);
};

const generateAbbreviatedFirstNameEmails = (
  firstName,
  lastName,
  initials,
  hostName,
  emails
) => {
  emails.push(`${firstName}${lastName}@${hostName}`);
  addInitialsEmail(initials, hostName, emails);
  emails.push(`${firstName}.${lastName}@${hostName}`);
  emails.push(`${lastName}@${hostName}`);
};

const generateAbbreviatedLastNameEmails = (
  firstName,
  initials,
  hostName,
  emails
) => {
  emails.push(`${firstName}@${hostName}`);
  addInitialsEmail(initials, hostName, emails);
};

const addCommonEmails = (firstName, lastName, hostName, emails) => {
  emails.push(`${firstName}.${lastName}@${hostName}`);
  emails.push(`${firstName}@${hostName}`);
};

const addTwoWordsEmails = (firstName, lastName, hostName, emails) => {
  emails.push(`${firstName[0]}.${lastName}@${hostName}`);
  emails.push(`${firstName[0]}${lastName}@${hostName}`);
  emails.push(`${lastName}@${hostName}`);
};

const addTwoWordsInLastNameEmails = (firstName, lastWord, hostName, emails) => {
  emails.push(`${firstName}.${lastWord}@${hostName}`);
  emails.push(`${firstName[0]}.${lastWord}@${hostName}`);
  emails.push(`${firstName[0]}${lastWord}@${hostName}`);
  emails.push(`${lastWord}@${hostName}`);
};

const addInitialsEmail = (initials, hostName, emails) => {
  emails.push(`${initials}@${hostName}`);
};
