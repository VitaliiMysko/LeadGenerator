if (!window.leadGenerator.experienceDataInit) {
  window.leadGenerator.experienceData = window.leadGenerator.experienceData || {};

  (() => {
    const getCompaniesAndJobPosition = () => {
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
              const jobPositionElement =
                GetJobPositionElement(positionComponent);

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

    window.leadGenerator.experienceData.getCompaniesAndJobPosition = getCompaniesAndJobPosition;
  })();

  window.leadGenerator.experienceDataInit = true;
}
