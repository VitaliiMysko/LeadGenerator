const SALES_NAVIGATOR_LEAD_URL_REGEX = /^https:\/\/www\.linkedin\.com\/sales\/lead\//;
const LINKEDIN_PROFILE_URL_REGEX = /^https:\/\/www\.linkedin\.com\/in\//;

export function getLinkedInPageType(url) {
  if (typeof url !== "string") return null;
  if (SALES_NAVIGATOR_LEAD_URL_REGEX.test(url)) return "salesNavigatorLead";
  if (LINKEDIN_PROFILE_URL_REGEX.test(url)) return "linkedinProfile";
  return null;
}
