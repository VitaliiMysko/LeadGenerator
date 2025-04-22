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

  if (request.action === "verifyEmail") {
    (async () => {
      const result = await verifyEmail(request.email);
      sendResponse(result);
    })();

    return true;
  }

  if (request.action === "fetchPage") {
    if (activeRequests[request.url]) {
      sendResponse(activeRequests[request.url]);
      return;
    }

    chrome.tabs.create(
      {
        url: request.url,
        active: false,
      },
      (tab) => {
        const tabId = tab.id;

        chrome.tabs.onUpdated.addListener(async function listener(
          updatedTabId,
          info
        ) {
          if (tabId === updatedTabId && info.status === "complete") {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                files: [
                  "src/utils/mutation-observer.js",
                  "src/content-scripts/website-data.js",
                ],
              },
              async (res) => {
                chrome.runtime.onMessage.addListener(
                  async function responseListener(response, sender) {
                    if (response.action === "pageContent") {
                      if (response.data && request.url === response.data.url) {
                        const result = await checkWebsiteStatus(
                          response.data.website
                        );
                        activeRequests[request.url] = result;

                        sendResponse(result);
                        chrome.runtime.onMessage.removeListener(
                          responseListener
                        );
                      }
                    }
                  }
                );
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
  }
});

function checkWebsiteStatus(url) {
  return new Promise((resolve) => {
    if (url) {
      fetch(url, { method: "HEAD" })
        .then((response) => {
          resolve({ url: url, status: response.status, ok: response.ok });
        })
        .catch(() => {
          resolve({ url: url, status: 0, ok: false });
        });
    } else {
      resolve({ url: url, status: 0, ok: false });
    }
  });
}

async function verifyEmail(email) {
  const apiKey = "live_45885526fe81fa4f8dc8";
  const url = `https://api.emailable.com/v1/verify?email=${encodeURIComponent(
    email
  )}&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // result.state: "deliverable", "undeliverable", "risky", etc.
    if (result.state === "deliverable") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Email verification failed:", err);
    return false;
  }
}
