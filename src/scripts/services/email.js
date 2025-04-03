import {
  getFirstNameElement,
  getSecondNameElement,
} from "../helper/dom-helper.js";

export const getBasicEmail = (hostName) => {
  const fullName = getFullName();
  const emailName = prepareBasicEmailName(fullName);
  return `${emailName}@${hostName}`;
};

function getFullName() {
  return `${getFirstNameElement().value} ${getSecondNameElement().value}`;
}

function prepareBasicEmailName(fullName) {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/(\S)\s+(\S)/g, "$1.$2")
    .replace(/^-+|-+$/g, "")
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

  if (parts.length === 2 && !firstName.includes("-")) {
    generateTwoWordsEmails(firstName, lastName, initials, hostName, emails);
  } else if (parts.length === 2 && firstName.includes("-")) {
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
  addCommonEmails(firstName, lastName, hostName, emails);
  addInitialsEmail(initials, hostName, emails);
  addTwoWordsInLastNameEmails(firstName, lastWord, hostName, emails);
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