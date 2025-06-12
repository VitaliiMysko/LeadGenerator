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

  let container;
  waitForElementWithTimeout("._header_1808vy")
    .then((element) => {
      data.industry = element
        .querySelector("span[data-anonymize='industry']")
        .textContent.trim();
      data.location = element
        .querySelector("div[data-anonymize='location']")
        .textContent.trim();
      container = element;
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .then((element) => {
      data.website = container.querySelector(".view-website-link").href || "";
    })
    .catch((error) => {
      console.error("Error finding element:", error);
    })
    .finally(async () => {
      if (data.website === "" || data.industry === "") {
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
      });

      if (response) {
        data.website = response.website;
        data.industry = data.industry ? data.industry : response.industry;
        data.location = data.location ? data.location : response.location;
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
    chrome.runtime.sendMessage({ action: "salesNavigatorCompanyPageContent", data }, () => {
      chrome.runtime.sendMessage({ action: "closeTab" });
    });
  };
})();
