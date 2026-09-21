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
// TASK KINDS
// Each kind describes what to inject into the hidden tab once it finishes
// loading, and which message action carries its result back.
// -----------------------------
const TASK_KINDS = {
  company: {
    scriptFiles: [
      "src/utils/mutation-observer.js",
      "src/content-scripts/linkedin-pages/company.js",
    ],
    responseAction: "linkedinCompanyPageContent",
  },
  profileExperience: {
    scriptFiles: [
      "src/utils/mutation-observer.js",
      "src/content-scripts/common/constants.js",
      "src/content-scripts/linkedin-pages/lead/lead-experience.js",
      "src/content-scripts/linkedin-pages/lead/experience-details-fetch.js",
    ],
    responseAction: "linkedinProfileExperienceContent",
  },
};

// -----------------------------
// PER-SESSION IN-FLIGHT TASK TRACKER
// key: sessionId (unique per popup lifetime, generated in company-data.js /
// extract-data.js)
// value: { kind, tabId, resolve, timeoutId, url, location, industry, size }
// -----------------------------
const sessionTasks = new Map();

function findSessionByTabId(tabId) {
  for (const [sessionId, task] of sessionTasks) {
    if (task.tabId === tabId) return sessionId;
  }
  return null;
}

function cancelSessionTask(sessionId) {
  const task = sessionTasks.get(sessionId);
  if (!task) return;
  clearTimeout(task.timeoutId);
  sessionTasks.delete(sessionId);
  chrome.tabs.remove(task.tabId, () => {});
  task.resolve(null);
}

function finishTask(sessionId, result) {
  const task = sessionTasks.get(sessionId);
  if (!task) return;
  clearTimeout(task.timeoutId);
  sessionTasks.delete(sessionId);
  chrome.tabs.remove(task.tabId, () => {});
  task.resolve(result);
}

// -----------------------------
// GLOBAL LISTENERS
// -----------------------------
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status !== "complete") return;
  const sessionId = findSessionByTabId(tabId);
  if (!sessionId) return;
  const task = sessionTasks.get(sessionId);

  // Reset timeout from when the page actually loads, not from tab creation
  clearTimeout(task.timeoutId);
  task.timeoutId = setTimeout(() => {
    console.warn("Post-load timeout for tab:", task.url);
    finishTask(sessionId, null);
  }, 10000);

  const scriptFiles = TASK_KINDS[task.kind].scriptFiles;

  if (task.kind === "company") {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: (initData) => { window.leadGeneratorInitData = initData; },
        args: [{ location: task.location, industry: task.industry, size: task.size }],
      },
      () => {
        if (chrome.runtime.lastError) return;
        chrome.scripting.executeScript({ target: { tabId }, files: scriptFiles });
      }
    );
  } else {
    chrome.scripting.executeScript({ target: { tabId }, files: scriptFiles });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchLinkedinCompanyPage") {
    handleTaskRequest("company", message, sendResponse);
    return true;
  }

  if (message.action === "fetchLinkedinProfileExperience") {
    handleTaskRequest("profileExperience", message, sendResponse);
    return true;
  }

  const responseActions = Object.values(TASK_KINDS).map((kind) => kind.responseAction);
  if (responseActions.includes(message.action)) {
    const tabId = sender.tab?.id;
    if (!tabId) return;
    const sessionId = findSessionByTabId(tabId);
    if (sessionId) finishTask(sessionId, message.data || null);
  }
});

// Clean up if the user manually closes a hidden scraper tab
chrome.tabs.onRemoved.addListener((tabId) => {
  const sessionId = findSessionByTabId(tabId);
  if (!sessionId) return;
  const task = sessionTasks.get(sessionId);
  clearTimeout(task.timeoutId);
  sessionTasks.delete(sessionId);
  task.resolve(null);
});

// -----------------------------
// MAIN MESSAGE HANDLER
// -----------------------------
function handleTaskRequest(kind, request, sendResponse) {
  const { sessionId, url, location, industry, size } = request;

  // Cancel any in-flight task for this session (user switched company / re-extracted mid-fetch)
  cancelSessionTask(sessionId);

  chrome.tabs.create({ url, active: false }, (tab) => {
    // Fallback timeout from tab creation in case 'complete' never fires
    const timeoutId = setTimeout(() => {
      console.warn("Creation timeout for tab:", url);
      finishTask(sessionId, null);
    }, 30000);

    sessionTasks.set(sessionId, {
      kind,
      tabId: tab.id,
      resolve: sendResponse,
      timeoutId,
      url,
      location,
      industry,
      size,
    });
  });
}

