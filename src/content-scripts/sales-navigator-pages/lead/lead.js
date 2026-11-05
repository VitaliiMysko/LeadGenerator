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
        value: await getLinkedInProfileUrl(),
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

    const ACTIONS_MENU_TIMEOUT_MS = 3000;

    // The "link" field only ever holds the person's public LinkedIn page
    // ("linkedin.com/in/..."), never a Sales Navigator one; "" when the
    // public page can't be found.
    async function getLinkedInProfileUrl() {
      return (
        findPublicProfileUrl() ||
        (await getLinkedInProfileUrlViaActionsMenu())
      );
    }

    function findPublicProfileUrl() {
      const links = document.querySelectorAll('a[href*="linkedin.com/in/"]');
      for (const link of links) {
        const url = window.leadGenerator.toPublicProfileUrl(link.href);
        if (url) return url;
      }
      return "";
    }

    // The public page link is usually only rendered inside the lead's "..."
    // actions menu. It wasn't in the page before the menu was opened, so a
    // public profile link appearing after opening it is the menu's one.
    async function getLinkedInProfileUrlViaActionsMenu() {
      const actionsMenuElement = getActionsMenuElement();
      if (!actionsMenuElement) return "";
      actionsMenuElement.click();

      try {
        return await window.leadGenerator.waitForConditionWithTimeout(
          findPublicProfileUrl,
          ACTIONS_MENU_TIMEOUT_MS
        );
      } catch {
        return "";
      } finally {
        closeActionsMenu(actionsMenuElement);
      }
    }

    function closeActionsMenu(actionsMenuElement) {
      if (actionsMenuElement.getAttribute("aria-expanded") === "false") return;
      actionsMenuElement.click();
    }

    function getFullNameElement() {
      //id="hue-menu-trigger-ember51"; id="hue-menu-trigger-ember52"
      return document.querySelector(
        'h1[data-x--lead--name][data-anonymize="person-name"]'
      );
    }

    function getActionsMenuElement() {
      return document.querySelector(
        "button[data-x--lead-actions-bar-overflow-menu]"
      );
    }

    window.leadGenerator.personalData.getPersonalData = getPersonalData;
  })();

  window.leadGenerator.personalDataInit = true;
}
