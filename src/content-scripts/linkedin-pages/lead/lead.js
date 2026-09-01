if (!window.leadGenerator.personalDataInit) {
  window.leadGenerator.personalData = window.leadGenerator.personalData || {};

  (async () => {
    const getPersonalData = async () => {
      let generalData = [];
      const fullName = getFullName();
      generalData.push({
        inputId: "first-name",
        value: getFirstName(fullName),
      });
      generalData.push({
        inputId: "second-name",
        value: getSecondName(fullName),
      });
      generalData.push({ inputId: "job-position", value: getJobPosition() });
      generalData.push({
        inputId: "link",
        value: getLinkedInProfileUrl(),
      });
      generalData.push({ inputId: "email", value: "" });
      generalData.push({ inputId: "company-name", value: "" });

      return generalData;
    };

    function getFullName() {
      const fullNameElement = getFullNameElement();
      if (!fullNameElement) return "";

      return window.leadGenerator.nameUtils.handleFullName(fullNameElement.textContent);
    }

    function getFirstName(fullName) {
      return window.leadGenerator.nameUtils.getFirstName(fullName);
    }

    function getSecondName(fullName) {
      return window.leadGenerator.nameUtils.getSecondName(fullName);
    }

    function getJobPosition() {
      return "";
    }

    function getLinkedInProfileUrl() {
      return window.location.href.trim().split("?")[0];
    }

    // LinkedIn's public profile page has no stable class on the name heading,
    // and searching the whole document for the first <h1>/<h2> is not safe:
    // the global top nav (outside the page's main content) also has hidden
    // headings for its icons (e.g. an <h2>"Notifications"), which sit earlier
    // in the DOM than the profile name and were being picked up instead.
    // Scoping to <main> excludes the top nav; the name is reliably the first
    // heading within it — the "Experience" section heading (and every other
    // section heading) is also an <h2>, but always appears further down.
    // NAV_HEADING_TEXTS is a defense-in-depth filter in case a <main>-scoped
    // nav-like heading ever slips through.
    const NAV_HEADING_TEXTS = ["notifications", "messaging", "my network", "jobs", "home"];

    function getFullNameElement() {
      const scope = document.querySelector("main") || document;
      const headings = [...scope.querySelectorAll("h1, h2")];
      return (
        headings.find(
          (heading) => !NAV_HEADING_TEXTS.includes(heading.textContent.trim().toLowerCase()),
        ) || null
      );
    }

    window.leadGenerator.personalData.getPersonalData = getPersonalData;
  })();

  window.leadGenerator.personalDataInit = true;
}
