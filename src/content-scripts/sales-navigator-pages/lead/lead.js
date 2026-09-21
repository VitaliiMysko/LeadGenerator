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

    async function getLinkedInProfileUrl() {
      let linkProfileUrl = getLinkedInProfileUrlDirect();
      if (linkProfileUrl === "") {
        linkProfileUrl = await getLinkedInProfileUrlViaSalesNavigator();
      }
      return linkProfileUrl;
    }

    function getLinkedInProfileUrlDirect() {
      const xpath = "//a[contains(@href, 'https://www.linkedin.com/in/')]"; // XPath
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const linkProfileUrlElement = result.singleNodeValue;
      const linkProfileUrl = linkProfileUrlElement
        ? linkProfileUrlElement.href
        : "";
      return linkProfileUrl.trim().split("?")[0];
    }

    async function getLinkedInProfileUrlViaSalesNavigator() {
      const actionsMenuElement = getActionsMenuElement();
      if (!actionsMenuElement) return "";
      actionsMenuElement.click();

      await new Promise((resolve) => setTimeout(resolve, 350));

      let linkProfileUrl = "";
      const dropdownMenuElement =
        findElementByCSSVariable("--x-hue-web-level", 10000) ??
        getDropdownMenuElement();
      if (dropdownMenuElement) {
        const linkProfileUrlElement = dropdownMenuElement.querySelector("a");
        linkProfileUrl = linkProfileUrlElement
          ? linkProfileUrlElement.href
          : "";
      }

      actionsMenuElement.click();
      return linkProfileUrl;
    }

    function getFullNameElement() {
      //id="hue-menu-trigger-ember51"; id="hue-menu-trigger-ember52"
      return document.querySelector(
        'h1[data-x--lead--name][data-anonymize="person-name"]'
      );
    }

    function getActionsMenuElement() {
      return document.querySelector(
        'button[data-x--lead-actions-bar-overflow-menu][aria-label="Open actions overflow menu"]'
      );
    }

    function getDropdownMenuElement() {
      return document.getElementById("hue-menu-ember49");
    }

    function findElementByCSSVariable(varName, varValue) {
      return [...document.querySelectorAll("*")].find(
        (el) =>
          getComputedStyle(el).getPropertyValue(varName).trim() ===
          varValue.toString()
      );
    }

    window.leadGenerator.personalData.getPersonalData = getPersonalData;
  })();

  window.leadGenerator.personalDataInit = true;
}
