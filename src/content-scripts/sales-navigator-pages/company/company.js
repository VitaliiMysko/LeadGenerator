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
    if (message.action === "initSalesNavigatorCompanyData") {
      data.location = message.data.location || "";
      data.industry = message.data.industry || "";
      data.size = message.data.size || "";
    }
  });

  let container;
  waitForElementWithTimeout("._header_1808vy")
    .then((element) => {
      container = element;
      data.website = container.querySelector(".view-website-link").href || "";
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      if (!data.location) {
        data.location =
          container
            .querySelector("div[data-anonymize='location']")
            .textContent.trim() || "";
      }
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      if (!data.industry) {
        data.industry =
          container
            .querySelector("span[data-anonymize='industry']")
            .textContent.trim() || "";
      }
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      if (!data.size) {
        const linkCompanySizeElement = container.querySelector(
          '[data-anonymize="company-size"]',
        );

        if (!linkCompanySizeElement) {
          return waitForElementWithTimeout('[data-anonymize="company-size"]')
            .then((element) => {
              data.size =
                element.querySelector("span").textContent.trim() || "";
            })
            .catch((error) => {
              console.error("Error finding element:", error);
            });
        } else {
          data.size =
            linkCompanySizeElement.querySelector("span").textContent.trim() ||
            "";
        }
      }
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .finally(async () => {
      if (!data.website || !data.industry) {
        await fillDataFromLinkedinCompanyPage();
      }
      sendMessageAndCloseTab(data);
    });

  const fillDataFromLinkedinCompanyPage = async () => {
    let linkedinCompanyUrl = getLinkedinCompanyUrl();

    try {
      const response = await sendMessagePromise({
        action: "fetchLinkedinCompanyPage",
        url: linkedinCompanyUrl,
        location: data.location,
        industry: data.industry,
        size: data.size,
      });

      if (response) {
        data.website = response.website;
        data.industry = data.industry ? data.industry : response.industry;
        data.location = data.location ? data.location : response.location;
        data.size = data.size ? data.size : response.size;
      }
    } catch (error) {
      console.error("Error fetching data from linkedin comany page:", error);
    }
  };

  function getLinkedinCompanyUrl() {
    const currentUrl = window.location.href;
    const publicCompanyUrl = currentUrl.replace("/sales/", "/");
    return `${publicCompanyUrl}/about`;
  }

  function sendMessagePromise(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  const sendMessageAndCloseTab = (data) => {
    chrome.runtime.sendMessage(
      { action: "salesNavigatorCompanyPageContent", data },
      () => {
        chrome.runtime.sendMessage({ action: "closeTab" });
      },
    );
  };
})();
