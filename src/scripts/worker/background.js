// -----------------------------
// DEV ICON (grey tint in local env)
// -----------------------------
chrome.runtime.onInstalled.addListener(applyDevIconIfLocal);
chrome.runtime.onStartup.addListener(applyDevIconIfLocal);

async function applyDevIconIfLocal() {
  if (chrome.runtime.getManifest().environment !== "local") return;

  const sizes = [16, 32, 48, 128];
  const imageData = {};

  for (const size of sizes) {
    const url = chrome.runtime.getURL(`assets/icons/logo-${size}.png`);
    const response = await fetch(url);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.filter = "grayscale(100%)";
    ctx.drawImage(bitmap, 0, 0);

    imageData[size] = ctx.getImageData(0, 0, size, size);
  }

  await chrome.action.setIcon({ imageData });
}

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

  if (request.action === "fetchLinkedinCompanyPage") {
    handleCompanyRequest(request, sendResponse);
    return true;
  }
});

// -----------------------------
// CORE HANDLER
// -----------------------------
function handleCompanyRequest(request, sendResponse) {
  const key = request.url;

  // 🔁 reuse ongoing request
  if (activeRequests.has(key)) {
    activeRequests.get(key).then(sendResponse);
    return;
  }

  const promise = fetchCompanyData(request)
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
function fetchCompanyData(request) {
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
        }, 12000); // ⏱ 12s timeout

        const onUpdated = (updatedTabId, info) => {
          if (updatedTabId !== tabId || info.status !== "complete") return;

          chrome.scripting.executeScript(
            {
              target: { tabId },
              func: (initData) => { window.leadGeneratorInitData = initData; },
              args: [{ location: request.location, industry: request.industry, size: request.size }],
            },
            () => {
              if (chrome.runtime.lastError) return;
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  files: [
                    "src/utils/mutation-observer.js",
                    "src/content-scripts/linkedin-pages/company.js",
                  ],
                },
                () => {
                  if (chrome.runtime.lastError) return;
                  chrome.tabs.onUpdated.removeListener(onUpdated);
                }
              );
            }
          );
        };

        const onMessage = (response, sender) => {
          if (!sender.tab || sender.tab.id !== tabId) return;

          const isValid = response.action === "linkedinCompanyPageContent";

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