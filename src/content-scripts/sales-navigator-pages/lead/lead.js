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

      return handleFullName(fullNameElement.textContent);
    }

    function handleFullName(str) {
      const hasCyrillic = /\p{Script=Cyrillic}/u.test(str);
      if (hasCyrillic) {
        return str
        .trim()
        .split(/\s+/)
        .join(" ");
      }

      // \P{L} (not a Unicode letter) covers any script, not just the hand-picked
      // Latin-1/Latin Extended-A range used previously, which incorrectly ate into
      // names whose first letter falls just outside that narrower range.
      str = str.replace(/^\P{L}+/u, "");
      // Removes the prefix dr/Dr/prof/Prof before the full name
      str = str
        .trim()
        .replace(
          /^(prof\.?\s+)?(prof\.?|prof,?|dr\.?|dr,?|dr\.-ing\.?)\s+(?=\p{L})/iu,
          ""
        );
      const [textBeforeComma] = str.split(",");
      const dutchSurnames = window.leadGenerator.constants.dutchSurnames;

      return textBeforeComma
        .trim()
        .split(/\s+/) // Break the line into words, given a few spaces
        .map((word) => {
          if (dutchSurnames.includes(word.toLowerCase())) {
            return word.toLowerCase();
          }
          if (word.match(/^(Mc|Mac)([A-Z])/)) {
            return word; // Capital letter after prefix Mc/Mac isn't changed to lowercase
          }
          return word
            .split("-")
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join("-");
        })
        .join(" ");
    }

    function getFirstName(fullName) {
      return fullName.split(" ")[0] || "";
    }

    function getSecondName(fullName) {
      const parts = fullName.split(" ");
      let secondName = parts.length > 1 ? parts.slice(1).join(" ") : "";

      if (secondName.includes("'")) {
        secondName = secondName.replace(/'\p{L}/gu, (match) => match.toUpperCase());
      }

      return secondName;
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
