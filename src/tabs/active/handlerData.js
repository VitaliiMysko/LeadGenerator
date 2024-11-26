if (!window.messageListenerAdded) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData") {
      (async () => {
        const data = await getData();
        sendResponse({ data });
      })();
      return true;
    }
  });

  window.messageListenerAdded = true;
}

if (typeof window.gettinglinkedinProfileUrlInProgress === "undefined") {
  window.gettinglinkedinProfileUrlInProgress = false;
}

async function getData() {
  let data = [];
  let generalData = [];
  let companiesAndJobPosition = [];

  try {
    generalData = await getGeneralData();
    companiesAndJobPosition = getCompaniesAndJobPosition();
  } catch (error) {
    console.error("Problems with getting data", error.message);
  }

  data.push({ category: "generalData", value: generalData });
  data.push({ category: "comany&jobPosition", value: companiesAndJobPosition });

  return data;

  //>>>>>>>>>>>>>>>>>>GET GENERAL_DATA<<<<<<<<<<<<<<<<<<
  async function getGeneralData() {
    let generalData = [];
    const fullName = getFullName();
    generalData.push({ inputId: "firstName", value: getFirstName(fullName) });
    generalData.push({ inputId: "secondName", value: getSecondName(fullName) });
    generalData.push({ inputId: "jobPosition", value: getJobPosition() });
    generalData.push({ inputId: "link", value: await getlinkedinProfileUrl() });
    generalData.push({ inputId: "email", value: "" });
    generalData.push({ inputId: "companyName", value: "" });

    return generalData;
  }

  function getFullName() {
    const element = document.querySelector(
      'h1[data-x--lead--name][data-anonymize="person-name"]'
    );

    if (element) {
      return handleFullName(element.textContent);
    }

    return "";
  }

  function handleFullName(str) {
    str = str.trim().replace(/^(|dr\.?|dr\,?)\s+(?=[A-Z])/i, ""); // Removes the prefix dr/Dr before the full name
    const exceptions = ["van", "der", "den", "de"];
    const [textBeforeComma] = str.split(",");

    return textBeforeComma
      .trim()
      .split(/\s+/) // Break the line into words, given a few spaces
      .map((word) => {
        if (exceptions.includes(word.toLowerCase())) {
          return word.toLowerCase();
        } else {
          return word
            .split("-")
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join("-");
        }
      })
      .join(" ");
  }

  function getFirstName(fullName) {
    let [firstName] = fullName.includes(" ") ? fullName.split(" ") : "";
    return firstName;
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
    if (window.gettinglinkedinProfileUrlInProgress) {
      console.error("Already processing request");
      return "";
    }

    window.gettinglinkedinProfileUrlInProgress = true;

    try {
      const button = document.getElementById("hue-menu-trigger-ember51");

      if (!button) {
        console.error("There is problem with exporting linkedin profile url");
        return "";
      }
      button.click();

      await new Promise((resolve) => setTimeout(resolve, 250));

      const dropdownMenu = document.getElementById("hue-menu-ember51");
      if (dropdownMenu) {
        const linkProfile = dropdownMenu.querySelector("a");
        button.click();

        if (linkProfile) {
          console.log("Profile link found", linkProfile);
          console.log("href", linkProfile.href);
          return linkProfile.href;
        } else {
          console.error("Profile link not found");
          return "";
        }
      } else {
        console.error("Dropdown menu not found");
        return "";
      }
    } finally {
      window.gettinglinkedinProfileUrlInProgress = false;
    }
  }

  //>>>>>>>>>>>>>>>>>>GET GENERAL_DATA<<<<<<<<<<<<<<<<<<
  function getCompaniesAndJobPosition() {
    let comanyjobPositionData = [];

    const companyComponents = document.querySelectorAll(
      "._experience-entry_1irc72"
    );

    let id = 0;

    for (const companyComponent of companyComponents) {
      let name = "";
      let link = "";
      let jobPosition = "";

      const companyDataElement = companyComponent.children[0].children[1];

      link = GetCompanyLink(companyDataElement);
      name = GetCompanyName(companyDataElement);

      const jobPositionElement = GetJobPositionElement(companyDataElement);

      if (jobPositionElement) {
        jobPosition = jobPositionElement.textContent.trim();

        const actualPositionElement = companyDataElement.children[2];

        if (IsActualJobPosition(actualPositionElement)) {
          if (name != "" && jobPosition != "") {
            comanyjobPositionData.push({
              id: ++id,
              name: name,
              jobPosition: jobPosition,
              link: link,
            });
          }
        } else {
          break;
        }
      } else {
        const multiPositionCompanyComponent =
          companyComponent.querySelector("ul");

        if (multiPositionCompanyComponent) {
          const positionComponents =
            multiPositionCompanyComponent.querySelectorAll("li");

          for (const positionComponent of positionComponents) {
            const jobPositionElement = GetJobPositionElement(positionComponent);

            if (jobPositionElement) {
              jobPosition = jobPositionElement.textContent.trim();
            }

            const actualPositionElement =
              positionComponent.children[1].children[1];

            if (IsActualJobPosition(actualPositionElement)) {
              if (name != "" && jobPosition != "") {
                comanyjobPositionData.push({
                  id: ++id,
                  name: name,
                  jobPosition: jobPosition,
                  link: link,
                });
              }
            } else {
              break;
            }
          }
        }
      }
    }
    return comanyjobPositionData;
  }

  function GetCompanyLink(element) {
    let link = "";

    const linkElement = element.querySelector("a");

    if (linkElement) {
      link = linkElement.href;
      link = link.includes("sales/company") ? link : "";
    }
    return link;
  }

  function removeCompanyStatusRegex() {
    const companyStatus = [
      "inc",
      "ind",
      "corp",
      "ltd",
      "AB",
      "AS",
      "A/S",
      "ASA",
      "LP",
      "Plc",
      "S.L",
      "AG",
      "S.A",
      "S.p.A",
      "Aps",
      "LLC",
      "LLP",
      "PLC",
      "GmbH",
      "s.r.o",
      "spol",
    ];
    return new RegExp(
      `[\\s,]+(${companyStatus.join("|")})([.,](?=\\s|$)|\\s|$).*$`,
      "i"
    );
  }

  function GetCompanyName(element) {
    let name = "";
    let companyElement = element.querySelector(
      '[data-anonymize="company-name"]'
    );

    if (companyElement) {
      const regex = removeCompanyStatusRegex();
      name = companyElement.textContent.trim().replace(regex, "");
    }
    return name;
  }

  function GetJobPositionElement(element) {
    return element.querySelector('[data-anonymize="job-title"]');
  }

  function IsActualJobPosition(element) {
    if (element) {
      const periodElement = element.querySelector("span");

      if (periodElement) {
        const period = periodElement.textContent.trim();
        return period.includes("Present");
      }
    }
  }
}
