if (!window.leadGenerator.experienceDataInit) {
  window.leadGenerator.experienceData =
    window.leadGenerator.experienceData || {};

  (async () => {
    const getActualExperienceData = async () => {
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
          jobPosition = jobPositionElement.textContent
            .replace(/\p{Extended_Pictographic}/gu, "")
            .trim();

          const actualPositionElement = companyDataElement.children[2];

          if (isActualJobPosition(actualPositionElement)) {
            if (companyName != "" && jobPosition != "") {
              actualExperienceData.push({
                id: ++id,
                companyName: companyName,
                jobPosition: jobPosition,
                companylink: companylink,
                extraData: await getTooltipCompanyData(experienceComponent),
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
                jobPosition = jobPositionElement.textContent
                  .replace(/\p{Extended_Pictographic}/gu, "")
                  .trim();
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
                    extraData: await getTooltipCompanyData(experienceComponent),
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
      const companyStatus = window.leadGenerator.constants.companyStatus;
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
          .replace(/\p{Extended_Pictographic}/gu, "")
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

    async function getTooltipCompanyData(experienceComponent) {
      const companyTooltipElement = await triggerHoverAndWaitTooltip(
        experienceComponent
      );

      const extraCompanyData = extractCompanyData(companyTooltipElement);
      return extraCompanyData;
    }

    function triggerMouseHover(element) {
      if (!element) return;
      element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    }

    async function triggerHoverAndWaitTooltip(experienceComponent) {
      const link = experienceComponent.querySelector("a");
      if (!link) return "";

      const tooltipId = link.getAttribute("aria-describedby");
      if (!tooltipId) return "";

      const waitForElementById = window.leadGenerator.waitForElementById;

      triggerMouseHover(link);

      try {
        const tooltip = await waitForElementById(
          tooltipId,
          (el) => el.querySelector("li"), // tooltip has to have <li>
          5000
        );
        return tooltip;
      } catch (e) {
        return "";
      }
    }

    function extractCompanyData(tooltipElement) {
      if (!tooltipElement)
        return {
          industry: "",
          revenue: "",
          location: "",
          companySize: "",
        };

      const getTextByDataAttr = (attr) => {
        const el = tooltipElement.querySelector(`[data-anonymize="${attr}"]`);
        return el ? el.innerText.trim() : "";
      };

      return {
        industry: getTextByDataAttr("industry"),
        revenue: getTextByDataAttr("revenue"),
        location: getTextByDataAttr("location"),
        companySize: getTextByDataAttr("company-size"),
      };
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
