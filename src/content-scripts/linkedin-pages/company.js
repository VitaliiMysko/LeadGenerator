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

  let descriptionList;
  waitForElementWithTimeout(".org-page-details-module__card-spacing", 6000)
    .then((element) => {
      descriptionList = element.querySelector("dl");
      data.website =
        getDefinitionByTerm(descriptionList, "Website") ||
        getDefinitionByTerm(descriptionList, "Вебсайт");
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      if (!data.location) {
        data.location =
          getDefinitionByTerm(descriptionList, "Headquarters") ||
          getDefinitionByTerm(descriptionList, "Штаб-квартира");
      }
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      if (!data.industry) {
        data.industry =
          getDefinitionByTerm(descriptionList, "Industry") ||
          getDefinitionByTerm(descriptionList, "Галузь");
      }
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      if (!data.size) {
        data.size =
          getDefinitionByTerm(descriptionList, "Company size") ||
          getDefinitionByTerm(descriptionList, "Розмір компанії");
      }
      data.members =
        getMembersCount(descriptionList, "Company size") ||
        getMembersCount(descriptionList, "Розмір компанії");
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .finally(() => {
      sendMessageAndCloseTab(data);
    });

  const sendMessageAndCloseTab = (data) => {
    chrome.runtime.sendMessage({ action: "linkedinCompanyPageContent", data });
  };

  function getMembersCount(dlElement, termText) {
    const terms = dlElement.querySelectorAll("dt");
    for (let dt of terms) {
      if (dt.textContent.trim() === termText) {
        const firstDd = dt.nextElementSibling;
        if (firstDd?.tagName.toLowerCase() === "dd") {
          const secondDd = firstDd.nextElementSibling;
          if (secondDd?.tagName.toLowerCase() === "dd") {
            const match = secondDd.textContent.trim().match(/(\d[\d,]*)\s+associated members/i);
            return match ? match[1].replace(/,/g, "") : "";
          }
        }
      }
    }
    return "";
  }

  function getDefinitionByTerm(dlElement, termText) {
    const terms = dlElement.querySelectorAll("dt");

    for (let dt of terms) {
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
