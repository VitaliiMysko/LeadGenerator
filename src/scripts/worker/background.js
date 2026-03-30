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

  if (request.action === "fetchSalesNavigatorCompanyPage") {
    if (activeRequests[request.url]) {
      sendResponse(activeRequests[request.url]);
      return;
    }
    const location = request.location;
    const industry = request.industry;
    const size = request.size;

    chrome.tabs.create(
      {
        url: request.url,
        active: false,
      },
      (tab) => {
        const tabId = tab.id;

        chrome.tabs.onUpdated.addListener(
          async function listener(updatedTabId, info) {
            if (tabId === updatedTabId && info.status === "complete") {
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  files: [
                    "src/utils/mutation-observer.js",
                    "src/content-scripts/sales-navigator-pages/company/company.js",
                  ],
                },
                async (res) => {
                  chrome.tabs.sendMessage(tabId, {
                    action: "initSalesNavigatorCompanyData",
                    data: {
                      location,
                      industry,
                      size,
                    },
                  });

                  chrome.runtime.onMessage.addListener(
                    async function responseListener(response, sender) {
                      if (
                        response.action ===
                          "salesNavigatorCompanyPageContent" &&
                        request.url === response.data.url
                      ) {
                        const data = response.data;
                        if (data) {
                          const websiteState = await getkWebsiteState(data);
                          const result = {
                            website: data.website,
                            status: websiteState.status,
                            ok: websiteState.ok,
                            location: data.location,
                            industry: data.industry,
                            size: data.size,
                          };
                          activeRequests[request.url] = result;

                          sendResponse(result);
                        }
                        chrome.runtime.onMessage.removeListener(
                          responseListener,
                        );
                      }
                    },
                  );
                },
              );
              chrome.tabs.onUpdated.removeListener(listener);
            }
          },
        );
      },
    );

    return true;
  }

  if (request.action === "fetchLinkedinCompanyPage") {
    const location = request.location;
    const industry = request.industry;
    const size = request.size;

    chrome.tabs.create(
      {
        url: request.url,
        active: false,
      },
      (tab) => {
        const tabId = tab.id;

        chrome.tabs.onUpdated.addListener(
          async function listener(updatedTabId, info) {
            if (tabId === updatedTabId && info.status === "complete") {
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  files: [
                    "src/utils/mutation-observer.js",
                    "src/content-scripts/linkedin-pages/company.js",
                  ],
                },
                async (res) => {
                  chrome.tabs.sendMessage(tabId, {
                    action: "initLinkedinCompanyData",
                    data: {
                      location,
                      industry,
                      size,
                    },
                  });

                  chrome.runtime.onMessage.addListener(
                    async function responseListener(response, sender) {
                      if (
                        response.action === "linkedinCompanyPageContent" &&
                        sender.tab?.id === tabId
                      ) {
                        if (response.data) {
                          sendResponse(response.data);
                        }
                        chrome.runtime.onMessage.removeListener(
                          responseListener,
                        );
                      }
                    },
                  );
                },
              );
              chrome.tabs.onUpdated.removeListener(listener);
            }
          },
        );
      },
    );

    return true;
  }

  if (request.action === "closeTab" && sender.tab) {
    chrome.tabs.remove(sender.tab.id, () => {});
  }
});

function getkWebsiteState(data) {
  return new Promise((resolve) => {
    if (!data.website) {
      return resolve({ status: 0, ok: false });
    }

    fetch(data.website, {
      method: "GET",
      mode: "cors",
      headers: {
        "User-Agent": navigator.userAgent,
        Accept: "text/html",
      },
    })
      .then((response) => {
        resolve({
          status: response.status,
          ok: response.ok,
        });
      })
      .catch((error) => {
        resolve({
          status: 0,
          ok: false,
        });
      });
  });
}
