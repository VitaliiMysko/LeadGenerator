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
  waitForElementWithTimeout("._header_1808vy", 4000)
    .then((element) => {
      data.industry = element.querySelector("span[data-anonymize='industry']").textContent.trim();
      data.location = element.querySelector("div[data-anonymize='location']").textContent.trim();
      container = element;
    })
    .catch((error) => {
      console.error("Error finding element:", error);
      data.error = error.message;
    })
    .then((element) => {
      data.website = container.querySelector('.view-website-link').href || "";
    })
    .catch((error) => {
      console.error("Error finding element:", error);
      data.error = error.message;
    })
    .finally(() => {
      sendMessageAndCloseTab(data);
    });



  const sendMessageAndCloseTab = (data) => {
    chrome.runtime.sendMessage({ action: "pageContent", data }, () => {
      chrome.runtime.sendMessage({ action: "closeTab" });
    });
  };
})();
