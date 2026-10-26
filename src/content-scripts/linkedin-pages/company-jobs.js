(() => {
  const waitForConditionWithTimeout =
    window.leadGenerator.waitForConditionWithTimeout;

  // Job postings link to /jobs/view/<id> (or carry a currentJobId), whatever
  // the interface language, so their presence doesn't depend on any label.
  const JOB_LINK_SELECTOR = 'a[href*="/jobs/view/"], a[href*="currentJobId="]';

  // Postings may keep rendering for a moment after the first one appears.
  const SETTLE_DELAY = 1000;

  const data = {
    url: window.location.href,
    openJobTitles: null,
  };

  (async () => {
    try {
      await waitForConditionWithTimeout(
        () => document.querySelector(JOB_LINK_SELECTOR) || isRedirectedFromJobsTab(),
        7000,
      );
      if (isRedirectedFromJobsTab()) {
        data.openJobTitles = [];
      } else {
        await new Promise((resolve) => setTimeout(resolve, SETTLE_DELAY));
        data.openJobTitles = getJobTitles();
      }
    } catch {
      // No posting appeared: the company has no open jobs, unless the page
      // itself didn't load (e.g. LinkedIn redirected to a sign-in page), in
      // which case the result stays unknown and is checked again later.
      if (isCompanyPageLoaded()) data.openJobTitles = [];
    } finally {
      chrome.runtime.sendMessage({ action: "linkedinCompanyJobsContent", data });
    }
  })();

  function isCompanyPage() {
    return window.location.pathname.startsWith("/company/");
  }

  // A company with no open jobs has no Jobs tab: LinkedIn sends its /jobs URL
  // to another page of the company (e.g. About) instead.
  function isRedirectedFromJobsTab() {
    return isCompanyPage() && !window.location.pathname.includes("/jobs");
  }

  // Any heading counts: the company name isn't necessarily inside <main>.
  function isCompanyPageLoaded() {
    return isCompanyPage() && !!document.querySelector("h1");
  }

  // One title per posting: a posting's card can hold several links to it.
  function getJobTitles() {
    const titlesById = new Map();
    for (const link of document.querySelectorAll(JOB_LINK_SELECTOR)) {
      const id = getJobId(link.href);
      if (!titlesById.get(id)) titlesById.set(id, getJobTitle(link));
    }
    return [...titlesById.values()];
  }

  function getJobId(href) {
    const url = new URL(href, window.location.href);
    return (
      url.searchParams.get("currentJobId") ||
      url.pathname.match(/\/jobs\/view\/(?:[^/]*-)?(\d+)/)?.[1] ||
      href
    );
  }

  // The card's heading when it has one, otherwise its first line of text,
  // which is where LinkedIn puts the job title (company and location follow).
  function getJobTitle(link) {
    const heading = link.querySelector("h1, h2, h3, h4, strong");
    const firstLine = (link.innerText || "")
      .split("\n")
      .map(normalizeSpace)
      .find(Boolean);
    return (
      normalizeSpace(heading?.innerText || "") ||
      firstLine ||
      normalizeSpace(link.getAttribute("aria-label") || "")
    );
  }

  function normalizeSpace(text) {
    return text.replace(/\s+/g, " ").trim();
  }
})();
