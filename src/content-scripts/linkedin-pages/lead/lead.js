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

    // LinkedIn's public profile page has no stable class on the name heading.
    // The name is reliably the first heading on the page — the "Experience"
    // section heading (and every other section heading) is also an <h2>, but
    // always appears further down the DOM, after the name.
    function getFullNameElement() {
      return document.querySelector("h1") || document.querySelector("h2");
    }

    window.leadGenerator.personalData.getPersonalData = getPersonalData;
  })();

  window.leadGenerator.personalDataInit = true;
}
