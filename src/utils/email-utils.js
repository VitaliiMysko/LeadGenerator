import { emailTemplates } from "../constants/email-templates.js";
import { trimAsciiWhitespace } from "./text-utils.js";

// Generated emails depend on the person's name as well as the domain, so a
// result cached for one person must not be reused for another at the same company.
export function buildEmailCacheKey(domain, firstName, lastName) {
  return JSON.stringify(
    [domain, firstName, lastName].map((value) =>
      trimAsciiWhitespace(value ?? "").toLowerCase(),
    ),
  );
}

export function prepareEmailName(fullName) {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/(\S)\s+(\S)/g, "$1.$2")
    .replace(/^-+|-+$/g, "")
    .replace(/\s(?=[a-zA-Z]+$)/, ".")
    .replace(/\.$/, "");
}

export function collectEmails(emails, hostName, fullName) {
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
    parts.length <= 3 && !parts.some((part) => part.includes("-"))
      ? parts.map((part) => part[0]).join("")
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
