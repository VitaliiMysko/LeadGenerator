import {
  getFirstNameElement,
  getSecondNameElement,
} from "../helper/dom-helper.js";

export const getBasicEmail = (hostName) => {
  const fulllName = `${getFirstNameElement().value} ${
    getSecondNameElement().value
  }`;
  const emailName = prepareEmailName(fulllName);
  return `${emailName}@${hostName}`;
};

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
  // const fullName = `${firstNameElement.value} ${secondNameElement.value}`;
  // const fullName = "Lars Erik Presterud";
  // const fullName = "Firstname Lastname";
  // const fullName = "Jean-Luc Picford";
  const fullName = "Stig-Ove Reitan Martinsen"
  // const fullName = "Morten Munch-Olsen";

  const emailName = prepareBasicEmailName(fullName);
  const parts = emailName.split(".");

  if (parts.length === 1) return [`${emailName}@${hostName}`];

  const [firstName, ...lastNames] = parts;
  const lastName = lastNames.join(".");
  const initials = parts.map((name) => name[0]).join("");
  
  const emails = [];
  emails.push(`${firstName}.${lastName}@${hostName}`);
  emails.push(`${firstName}@${hostName}`);

  if (parts.length === 2 && !firstName.includes("-")) {
    twoWordsEmails(firstName, lastName, initials, hostName, emails);
  } else if (parts.length === 2 && firstName.includes("-")) {
    twoWordsAndHyphenatedFirstNameEmails(firstName, lastName, hostName, emails);
  } else if (parts.length === 3 && !firstName.includes("-")) {
    twoWordsInLastNameEmails(firstName, lastName, initials, hostName, emails);
  } else {
    twoWordsInLastNameAndHyphenatedFirstName(
      firstName,
      lastName,
      hostName,
      emails
    );
  }

  return emails;
};

const twoWordsEmails = (firstName, lastName, initials, hostName, emails) => {
  emails.push(`${firstName[0]}.${lastName}@${hostName}`);
  emails.push(`${firstName[0]}${lastName}@${hostName}`);
  emails.push(`${lastName}@${hostName}`);
  emails.push(`${initials}@${hostName}`);
  emails.push(`${firstName}${lastName}@${hostName}`);
  emails.push(`${firstName}_${lastName}@${hostName}`);
};

const twoWordsAndHyphenatedFirstNameEmails = (
  firstName,
  lastName,
  hostName,
  emails
) => {
  const shortFirstName = firstName.split("-")[0];
  emails.push(`${shortFirstName}.${lastName}@${hostName}`);
  emails.push(`${firstName[0]}.${lastName}@${hostName}`);
  emails.push(`${firstName[0]}${lastName}@${hostName}`);
  emails.push(`${lastName}@${hostName}`);
};

const twoWordsInLastNameEmails = (
  firstName,
  lastName,
  initials,
  hostName,
  emails
) => {
  const lastWord = lastName.split(".").pop();
  emails.push(`${initials}@${hostName}`);
  emails.push(`${lastWord}@${hostName}`);
  emails.push(`${firstName[0]}.${lastWord}@${hostName}`);
  emails.push(`${firstName[0]}${lastWord}@${hostName}`);
  emails.push(`${firstName}.${lastWord}@${hostName}`);
};

const twoWordsInLastNameAndHyphenatedFirstName = (
  firstName,
  lastName,
  hostName,
  emails
) => {
  const shortFirstName = firstName.split("-")[0];
  const lastWord = lastName.split(".").pop();

  emails.push(`${firstName}.${lastWord}@${hostName}`);
  emails.push(`${shortFirstName}.${lastWord}@${hostName}`);
  emails.push(`${firstName[0]}${lastWord}@${hostName}`);
  emails.push(`${firstName[0]}.${lastWord}@${hostName}`); // firstname.lastlastname@example.com
  emails.push(`${lastWord}@${hostName}`); // lastlastname@example.com
};

console.log(generateEmails("example.com"));
