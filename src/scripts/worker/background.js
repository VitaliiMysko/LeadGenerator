// -----------------------------
// REQUEST CACHE (in-flight)
// -----------------------------
const activeRequests = new Map();

// -----------------------------
// MAIN MESSAGE LISTENER
// -----------------------------
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
    handleCompanyRequest(request, sendResponse, "sales");
    return true;
  }

  if (request.action === "fetchLinkedinCompanyPage") {
    handleCompanyRequest(request, sendResponse, "linkedin");
    return true;
  }
});

// -----------------------------
// CORE HANDLER
// -----------------------------
function handleCompanyRequest(request, sendResponse, type) {
  const key = `${type}:${request.url}`;

  // 🔁 reuse ongoing request
  if (activeRequests.has(key)) {
    activeRequests.get(key).then(sendResponse);
    return;
  }

  const promise = fetchCompanyData(request, type)
    .then((result) => {
      activeRequests.delete(key);
      return result;
    })
    .catch((error) => {
      console.error("Background error:", error);
      activeRequests.delete(key);

      return {
        website: "",
        location: request.location || "",
        industry: request.industry || "",
        size: request.size || "",
        error: true,
      };
    });

  activeRequests.set(key, promise);

  promise.then(sendResponse);
}

// -----------------------------
// FETCH COMPANY DATA
// -----------------------------
function fetchCompanyData(request, type) {
  return new Promise((resolve) => {
    chrome.tabs.create(
      {
        url: request.url,
        active: false,
      },
      (tab) => {
        const tabId = tab.id;

        const cleanup = () => {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          chrome.runtime.onMessage.removeListener(onMessage);
          if (tabId) {
            chrome.tabs.remove(tabId, () => {});
          }
        };

        const timeout = setTimeout(() => {
          console.warn("Timeout for tab:", request.url);
          cleanup();
          resolve(null);
        }, 10000); // ⏱ 10s timeout

        const onUpdated = (updatedTabId, info) => {
          if (updatedTabId === tabId && info.status === "complete") {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                files:
                  type === "sales"
                    ? [
                        "src/utils/mutation-observer.js",
                        "src/content-scripts/sales-navigator-pages/company/company.js",
                      ]
                    : [
                        "src/utils/mutation-observer.js",
                        "src/content-scripts/linkedin-pages/company.js",
                      ],
              },
              () => {
                chrome.tabs.sendMessage(tabId, {
                  action:
                    type === "sales"
                      ? "initSalesNavigatorCompanyData"
                      : "initLinkedinCompanyData",
                  data: {
                    location: request.location,
                    industry: request.industry,
                    size: request.size,
                  },
                });
              }
            );
          }
        };

        const onMessage = (response, sender) => {
          if (!sender.tab || sender.tab.id !== tabId) return;

          const isValid =
            (type === "sales" &&
              response.action === "salesNavigatorCompanyPageContent") ||
            (type === "linkedin" &&
              response.action === "linkedinCompanyPageContent");

          if (!isValid) return;

          clearTimeout(timeout);
          cleanup();

          resolve(response.data || null);
        };

        chrome.tabs.onUpdated.addListener(onUpdated);
        chrome.runtime.onMessage.addListener(onMessage);
      }
    );
  });
}