if (!window.leadGenerator.experienceDataInit) {
  window.leadGenerator.experienceData =
    window.leadGenerator.experienceData || {};

  (() => {
    const getActualExperienceData = () => {
      let actualExperienceData = [];
      const experienceComponents = getExperienceComponents();

      let id = 0;

      for (const experienceComponent of experienceComponents) {
        let companyName = "";
        let companylink = "";
        let jobPosition = "";

        const companyDataElement = experienceComponent.children[0].children[1];

        companylink = getCompanyLink(companyDataElement);
        companyName = getCompanyName(companyDataElement);

        const jobPositionElement = getJobPositionElement(companyDataElement);

        if (jobPositionElement) {
          jobPosition = jobPositionElement.textContent.trim();

          const actualPositionElement = companyDataElement.children[2];

          if (isActualJobPosition(actualPositionElement)) {
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
              multiPositionCompanyComponent.querySelectorAll(":scope > li");

            for (const positionComponent of positionComponents) {
              const jobPositionElement =
                getJobPositionElement(positionComponent);

              if (jobPositionElement) {
                jobPosition = jobPositionElement.textContent.trim();
              }

              const actualPositionElement =
                positionComponent.children[1].children[1];

              if (isActualJobPosition(actualPositionElement)) {
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

    function getCompanyLink(element) {
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

    function getCompanyName(element) {
      let name = "";
      let companyElement = getCompanyElement(element);

      if (companyElement) {
        const regex = removeCompanyStatusRegex();
        name = companyElement.textContent
          .trim()
          .replace(/[^\p{L}\p{N}\s-]/gu, "")
          .replace(regex, "");
      }
      return name;
    }

    function isActualJobPosition(element) {
      if (element) {
        const periodElement = element.querySelector("span");

        if (periodElement) {
          const period = periodElement.textContent.trim();
          return period.includes("Present") || period === "";
        }
      }
    }

    function getExperienceComponents() {
      return document.querySelectorAll("._experience-entry_1irc72");
    }

    function getCompanyElement(element) {
      return element.querySelector('[data-anonymize="company-name"]');
    }

    function getJobPositionElement(element) {
      return element.querySelector('[data-anonymize="job-title"]');
    }

    window.leadGenerator.experienceData.getActualExperienceData =
      getActualExperienceData;
  })();

  window.leadGenerator.experienceDataInit = true;
}
