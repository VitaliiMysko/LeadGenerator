let activeRequests = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAuthToken") {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          success: false,
          error: chrome.runtime.lastError.message,
        });
      } else {
        sendResponse({ success: true, token });
      }
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPage") {
    if (activeRequests[request.url] || activeRequests[request.url] === "") {
      sendResponse(activeRequests[request.url]);
      return;
    }

    chrome.windows.create(
      {
        url: request.url, // Page that should download
        type: "popup",
        state: "minimized", // "hidden" window
      },
      (window) => {
        const tabId = window.tabs[0].id;

        chrome.tabs.onUpdated.addListener(function listener(
          tabIdUpdated,
          info
        ) {
          if (tabId === tabIdUpdated && info.status === "complete") {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                files: [
                  "src/utils/mutation-observer.js",
                  "src/content-scripts/website-data.js",
                ],
              },
              (res) => {
                chrome.runtime.onMessage.addListener(function responseListener(
                  response,
                  sender
                ) {
                  if (response.action === "pageContent") {
                    if (response.data && request.url === response.data.url) {
                      activeRequests[request.url] = response.data.webSite;
                      sendResponse(response.data.webSite);
                      chrome.runtime.onMessage.removeListener(responseListener);
                    }
                  }
                });
              }
            );
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      }
    );

    return true;
  }

  if (request.action === "closeTab" && sender.tab) {
    chrome.tabs.remove(sender.tab.id, () => {});

    chrome.windows.remove(sender.tab.windowId, () => {});
  }
});
