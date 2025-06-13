(() => {
  const waitForElementWithTimeout =
    window.leadGenerator.waitForElementWithTimeout;

  data = {
    url: window.location.href,
    website: "",
    industry: "",
    location: "",
    error: "",
  };

  let descriptionList;
  waitForElementWithTimeout(".org-page-details-module__card-spacing")
    .then((element) => {
      descriptionList = element.querySelector("dl");
      data.website = getDefinitionByTerm(descriptionList, "Website");
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      data.industry = getDefinitionByTerm(descriptionList, "Industry");
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      data.location = getDefinitionByTerm(descriptionList, "Headquarters");
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .finally(() => {
      sendMessageAndCloseTab(data);
    });

  const sendMessageAndCloseTab = (data) => {
    chrome.runtime.sendMessage(
      { action: "linkedinCompanyPageContent", data },
      () => {
        chrome.runtime.sendMessage({ action: "closeTab" });
      }
    );
  };

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
