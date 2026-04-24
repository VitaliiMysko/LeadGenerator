(() => {
  const waitForElementWithTimeout =
    window.leadGenerator.waitForElementWithTimeout;

  data = {
    url: window.location.href,
    website: "",
    location: "",
    industry: "",
    size: "",
    error: "",
  };

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "initLinkedinCompanyData") {
      data.location = message.data.location || "";
      data.industry = message.data.industry || "";
      data.size = message.data.size || "";
    }
  });

  let descriptionList;
  waitForElementWithTimeout(".org-page-details-module__card-spacing")
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
      // if (!data.size) {
        data.size =
          getDefinitionByTerm(descriptionList, "Company size") ||
          getDefinitionByTerm(descriptionList, "Розмір компанії");
      // }
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
      },
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
