const LINKEDIN_DOMAIN_URL_REGEX = /^https:\/\/www\.linkedin\.com\//;
const LINKEDIN_PROFILE_URL_REGEX = /^https:\/\/www\.linkedin\.com\/in\//;

export function getLinkedInPageType(url) {
  if (typeof url !== "string") return null;
  if (LINKEDIN_PROFILE_URL_REGEX.test(url)) return "linkedinProfile";
  if (LINKEDIN_DOMAIN_URL_REGEX.test(url)) return "salesNavigatorLead";
  return null;
}
