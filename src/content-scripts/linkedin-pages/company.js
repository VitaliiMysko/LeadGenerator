(() => {
  const waitForElementWithTimeout =
    window.leadGenerator.waitForElementWithTimeout;

  const initData = window.leadGeneratorInitData || {};

  data = {
    url: window.location.href,
    website: "",
    location: initData.location || "",
    industry: initData.industry || "",
    size: initData.size || "",
    members: "",
    error: "",
  };

  (async () => {
    try {
      const element = await waitForElementWithTimeout(
        ".org-page-details-module__card-spacing",
        8000,
      );
      const descriptionList = element.querySelector("dl");

      data.website =
        getDefinitionByTerm(descriptionList, "Website") ||
        getDefinitionByTerm(descriptionList, "Вебсайт");

      if (!data.location) {
        data.location =
          getDefinitionByTerm(descriptionList, "Headquarters") ||
          getDefinitionByTerm(descriptionList, "Штаб-квартира");
      }

      if (!data.industry) {
        data.industry =
          getDefinitionByTerm(descriptionList, "Industry") ||
          getDefinitionByTerm(descriptionList, "Галузь");
      }

      if (!data.size) {
        data.size =
          getDefinitionByTerm(descriptionList, "Company size") ||
          getDefinitionByTerm(descriptionList, "Розмір компанії");
      }

      data.members =
        getMembersCount(descriptionList, "Company size") ||
        getMembersCount(descriptionList, "Розмір компанії");
    } catch (error) {
      console.error("Error finding element:", error);
    } finally {
      chrome.runtime.sendMessage({ action: "linkedinCompanyPageContent", data });
    }
  })();

  function getMembersCount(dlElement, termText) {
    const terms = dlElement.querySelectorAll("dt");
    for (const dt of terms) {
      if (dt.textContent.trim() === termText) {
        const firstDd = dt.nextElementSibling;
        if (firstDd?.tagName.toLowerCase() === "dd") {
          const secondDd = firstDd.nextElementSibling;
          if (secondDd?.tagName.toLowerCase() === "dd" && secondDd.querySelector("a")) {
            const match = secondDd.textContent.trim().match(/^(\d[\d,\s]*)/);
            return match ? match[1].replace(/[,\s]/g, "") : "";
          }
        }
      }
    }
    return "";
  }

  function getDefinitionByTerm(dlElement, termText) {
    const terms = dlElement.querySelectorAll("dt");
    for (const dt of terms) {
      if (dt.textContent.trim() === termText) {
        const dd = dt.nextElementSibling;
        if (dd && dd.tagName.toLowerCase() === "dd") {
          return dd.textContent.trim();
        }
      }
    }
    return "";
  }
})();
