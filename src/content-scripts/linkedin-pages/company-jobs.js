(() => {
  const waitForConditionWithTimeout =
    window.leadGenerator.waitForConditionWithTimeout;

  // Job postings link to /jobs/view/<id> (or carry a currentJobId), whatever
  // the interface language, so their presence doesn't depend on any label.
  const JOB_LINK_SELECTOR = 'a[href*="/jobs/view/"], a[href*="currentJobId="]';

  const data = {
    url: window.location.href,
    hasOpenJobs: null,
  };

  (async () => {
    try {
      await waitForConditionWithTimeout(
        () => document.querySelector(JOB_LINK_SELECTOR),
        7000,
      );
      data.hasOpenJobs = true;
    } catch {
      // No posting appeared: the company has no open jobs, unless the page
      // itself didn't load (e.g. LinkedIn redirected to a sign-in page), in
      // which case the result stays unknown and is checked again later.
      if (isCompanyPageLoaded()) data.hasOpenJobs = false;
    } finally {
      chrome.runtime.sendMessage({ action: "linkedinCompanyJobsContent", data });
    }
  })();

  function isCompanyPageLoaded() {
    return (
      window.location.pathname.startsWith("/company/") &&
      !!document.querySelector("main h1")
    );
  }
})();
