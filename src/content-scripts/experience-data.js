if (!window.leadGenerator.experienceDataInit) {
  window.leadGenerator.experienceData =
    window.leadGenerator.experienceData || {};

  (() => {
    const getActualExperienceData = () => {
      let actualExperienceData = [];
      const experienceComponents = GetExperienceComponents();

      let id = 0;

      for (const experienceComponent of experienceComponents) {
        let companyName = "";
        let companylink = "";
        let jobPosition = "";

        const companyDataElement = experienceComponent.children[0].children[1];

        companylink = GetCompanyLink(companyDataElement);
        companyName = GetCompanyName(companyDataElement);

        const jobPositionElement = GetJobPositionElement(companyDataElement);

        if (jobPositionElement) {
          jobPosition = jobPositionElement.textContent.trim();

          const actualPositionElement = companyDataElement.children[2];

          if (IsActualJobPosition(actualPositionElement)) {
            if (companyName != "" && jobPosition != "") {
              actualExperienceData.push({
                id: ++id,
                companyName: companyName,
                jobPosition: jobPosition,
                companylink: companylink,
              });
            }
          } else {
            break;
          }
        } else {
          const multiPositionCompanyComponent =
            experienceComponent.querySelector("ul");

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
                if (companyName != "" && jobPosition != "") {
                  actualExperienceData.push({
                    id: ++id,
                    companyName: companyName,
                    jobPosition: jobPosition,
                    companylink: companylink,
                  });
                }
              } else {
                break;
              }
            }
          }
        }
      }
      return actualExperienceData;
    };

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
      const companyStatus = window.leadGenerator.content.companyStatus;
      return new RegExp(
        `[\\s,]+(${companyStatus.join("|")})([.,](?=\\s|$)|\\s|$).*$`,
        "i"
      );
    }

    function GetCompanyName(element) {
      let name = "";
      let companyElement = GetCompanyElement(element);

      if (companyElement) {
        const regex = removeCompanyStatusRegex();
        name = companyElement.textContent.trim().replace(regex, "");
      }
      return name;
    }

    function GetExperienceComponents() {
      return document.querySelectorAll("._experience-entry_1irc72");
    }

    function GetCompanyElement(element) {
      return element.querySelector('[data-anonymize="company-name"]');
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

    window.leadGenerator.experienceData.getActualExperienceData =
      getActualExperienceData;
  })();

  window.leadGenerator.experienceDataInit = true;
}
