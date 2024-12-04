if (!window.leadGenerator.personalDataInit) {
  window.leadGenerator.personalData = window.leadGenerator.personalData || {};

  (async () => {
    const getPersonalData = async () => {
      console.log("<<<<<<<<getPersonalData");
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
        value: await getlinkedinProfileUrl(),
      });
      generalData.push({ inputId: "email", value: "" });
      generalData.push({ inputId: "company-name", value: "" });

      return generalData;
    };

    function getFullName() {
      const fullNamelement = getFullNameElement();

      if (!fullNamelement) return "";

      return handleFullName(fullNamelement.textContent);
    }

    function handleFullName(str) {
      // Removes the prefix dr/Dr before the full name
      str = str.trim().replace(/^(|dr\.?|dr\,?)\s+(?=[A-Z])/i, "");
      const [textBeforeComma] = str.split(",");
      const dutchSurnames = window.leadGenerator.content.dutchSurnames;

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
      let [firstName] = fullName.includes(" ") ? fullName.split(" ") : "";
      return firstName;
    }

    function getSecondName(fullName) {
      let [, ...remainingWords] = fullName.split(" ");
      let secondName =
        remainingWords.length > 0 ? remainingWords.join(" ") : "";

      if (secondName.includes("'")) {
        secondName = secondName.replace(/'\w/g, (match) => match.toUpperCase());
      }

      return secondName;
    }

    function getJobPosition() {
      return "";
    }

    async function getlinkedinProfileUrl() {
      const actionsMenuElement = getActionsMenuElement();

      if (!actionsMenuElement) return "";

      actionsMenuElement.click();

      await new Promise((resolve) => setTimeout(resolve, 350));

      let dropdownMenu =
        document.getElementById("hue-menu-ember51") ??
        document.getElementById("hue-menu-ember52");

      if (!dropdownMenu) return "";

      const linkProfile = dropdownMenu.querySelector("a");
      actionsMenuElement.click();

      return linkProfile ? linkProfile.href : "";
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

    window.leadGenerator.personalData.getPersonalData = getPersonalData;
  })();

  window.leadGenerator.personalDataInit = true;
}
