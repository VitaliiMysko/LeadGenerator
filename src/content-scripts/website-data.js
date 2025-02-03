(() => {
  const waitForElementWithTimeout =
    window.leadGenerator.waitForElementWithTimeout;

  data = {
    url: window.location.href,
    webSite: "",
    error: "",
  };

  waitForElementWithTimeout(".view-website-link", 4000)
    .then((element) => {
      data.webSite = element.href || "";
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
