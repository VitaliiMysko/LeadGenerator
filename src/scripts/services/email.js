import { firstNameElement, secondNameElement } from "../helper/dom-helper.js";

export const getBasicEmail = (hostName) => {
  const fulllName = `${firstNameElement.value} ${secondNameElement.value}`;
  const emailName = prepareEmailName(fulllName);
  return `${emailName}@${hostName}`;
};

function prepareEmailName(fullName) {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/(\S)\s+(\S)/g, "$1.$2")
    .replace(/^-+|-+$/g, "")
    .replace(/\.$/, "");
}
