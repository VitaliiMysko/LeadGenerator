if (!window.messageListenerAdded) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData") {
      (async () => {
        console.log("getData == getData");
        const data = await getData();
        sendResponse({ data });
      })();
      return true;
    }
  });

  console.log("<< messageListenerAdded >>");
  window.messageListenerAdded = true;
}

if (!window.leadGenerator.personalDataDeclared) {
  getFirstName = window.leadGenerator.personalData.getFirstName;
  window.leadGenerator.personalDataDeclared = true;
}

if (!window.leadGenerator.experienceDataDeclared) {
  getActualExperienceData = window.leadGenerator.experienceData.getActualExperienceData;
  window.leadGenerator.experienceDataDeclared = true;
}



async function getData() {
  let data = [];
  let generalData = [];
  let actualExperienceData = [];

  try {
    generalData = await getGeneralData();
    actualExperienceData = getActualExperienceData();
  } catch (error) {
    console.error("Problems with getting data", error.message);
  }

  data.push({ category: "generalData", value: generalData });
  data.push({ category: "actualExperienceData", value: actualExperienceData });

  return data;

  async function getGeneralData() {
    let generalData = [];
    const fullName = getFullName();
    generalData.push({ inputId: "first-name", value: getFirstName(fullName) });
    generalData.push({
      inputId: "second-name",
      value: getSecondName(fullName),
    });
    generalData.push({ inputId: "job-position", value: getJobPosition() });
    generalData.push({ inputId: "link", value: await getlinkedinProfileUrl() });
    generalData.push({ inputId: "email", value: "" });
    generalData.push({ inputId: "company-name", value: "" });

    return generalData;
  }

  function getFullName() {
    const element = document.querySelector(
      'h1[data-x--lead--name][data-anonymize="person-name"]'
    );

    if (!element) return "";

    return handleFullName(element.textContent);
  }

  function handleFullName(str) {
    // Removes the prefix dr/Dr before the full name
    str = str.trim().replace(/^(|dr\.?|dr\,?)\s+(?=[A-Z])/i, "");
    const exceptions = ["van", "der", "den", "de"];
    const [textBeforeComma] = str.split(",");

    return textBeforeComma
      .trim()
      .split(/\s+/) // Break the line into words, given a few spaces
      .map((word) => {
        if (exceptions.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }

        if (word.match(/^(Mc|Mac)([A-Z])/)) {
          return word; // Capital letter after prefix Mc/Mac isn't changed to lowercase
        }

        return word
          .split("-")
          .map(
            (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          )
          .join("-");
      })
      .join(" ");
  }

  function getSecondName(fullName) {
    let [, ...remainingWords] = fullName.split(" ");
    let secondName = remainingWords.length > 0 ? remainingWords.join(" ") : "";

    if (secondName.includes("'")) {
      secondName = secondName.replace(/'\w/g, (match) => match.toUpperCase());
    }

    return secondName;
  }

  function getJobPosition() {
    return "";
  }

  async function getlinkedinProfileUrl() {
    //id="hue-menu-trigger-ember51"; id="hue-menu-trigger-ember52"
    const button = document.querySelector(
      'button[data-x--lead-actions-bar-overflow-menu][aria-label="Open actions overflow menu"]'
    );

    if (!button) return "";

    button.click();

    await new Promise((resolve) => setTimeout(resolve, 300));

    let dropdownMenu =
      document.getElementById("hue-menu-ember51") ??
      document.getElementById("hue-menu-ember52");

    if (!dropdownMenu) return "";

    const linkProfile = dropdownMenu.querySelector("a");
    button.click();

    return linkProfile ? linkProfile.href : "";
  }
}
