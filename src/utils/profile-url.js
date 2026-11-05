window.leadGenerator = window.leadGenerator || {};

(() => {
  // A person's public LinkedIn page is "linkedin.com/in/<id>", optionally on
  // a country subdomain and followed by a sub-page ("/details/experience/",
  // "/overlay/contact-info/"), a query or a hash. Anything else, such as a
  // Sales Navigator lead page ("linkedin.com/sales/lead/..."), is not one.
  const PUBLIC_PROFILE_URL_REGEX =
    /^https?:\/\/(?:[a-z0-9-]+\.)?linkedin\.com\/in\/([^/?#\s]+)/i;

  // Returns the canonical public profile URL
  // ("https://www.linkedin.com/in/<id>/") for any public profile URL,
  // or "" when the URL is not a person's public LinkedIn page.
  function toPublicProfileUrl(url) {
    if (typeof url !== "string") return "";
    const match = url.trim().match(PUBLIC_PROFILE_URL_REGEX);
    return match ? `https://www.linkedin.com/in/${match[1]}/` : "";
  }

  window.leadGenerator.toPublicProfileUrl = toPublicProfileUrl;
})();
