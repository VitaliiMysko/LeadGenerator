// -----------------------------
// TASK KINDS
// Each kind describes what to inject into the hidden tab once it finishes
// loading, and which message action carries its result back.
// -----------------------------
const TASK_KINDS = {
  company: {
    scriptFiles: [
      "src/utils/mutation-observer.js",
      "src/content-scripts/common/company-labels.js",
      "src/content-scripts/linkedin-pages/company.js",
    ],
    responseAction: "linkedinCompanyPageContent",
  },
  companyJobs: {
    scriptFiles: [
      "src/utils/mutation-observer.js",
      "src/content-scripts/linkedin-pages/company-jobs.js",
    ],
    responseAction: "linkedinCompanyJobsContent",
  },
  profileExperience: {
    scriptFiles: [
      "src/utils/mutation-observer.js",
      "src/utils/experience-period.js",
      "src/content-scripts/common/constants.js",
      "src/content-scripts/linkedin-pages/lead/lead-experience.js",
      "src/content-scripts/linkedin-pages/lead/experience-details-fetch.js",
    ],
    responseAction: "linkedinProfileExperienceContent",
  },
};

// -----------------------------
// PER-SESSION IN-FLIGHT TASK TRACKER
// key: sessionId (unique per panel iframe document, generated in company-data.js /
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
  if (message.action === "workerFetch") {
    handleWorkerFetch(message).then(
      (result) => sendResponse({ ok: true, result }),
      (error) => sendResponse({ ok: false, error: error?.message || String(error) })
    );
    return true;
  }

  if (message.action?.startsWith("tabBridge:")) {
    handleTabBridgeRequest(message, sender).then(
      (result) => sendResponse({ ok: true, result }),
      (error) => sendResponse({ ok: false, error: error?.message || String(error) })
    );
    return true;
  }

  // chrome.management isn't exposed to content scripts, nor to the panel's
  // framed page in Firefox. getSelf() needs no "management" permission.
  if (message.action === "getInstallType") {
    chrome.management.getSelf().then(
      (info) => sendResponse(info.installType),
      () => sendResponse(null)
    );
    return true;
  }

  if (message.action === "fetchLinkedinCompanyPage") {
    handleTaskRequest("company", message, sendResponse);
    return true;
  }

  if (message.action === "fetchLinkedinCompanyJobs") {
    handleTaskRequest("companyJobs", message, sendResponse);
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
// COMPANION: OPEN PANEL
// Leads Automate asks to open the panel on its search tab, so the panel's
// companion API (companion-api.js), which only an open panel answers, can
// run there. The floating panel's content script opens it as the launcher
// click does. Same ids as COMPANION_EXTENSION_IDS in src/constants/config.js
// (this classic script can't import it; a test keeps both in sync): Leads
// Automate's Chrome id and its Firefox add-on id.
// -----------------------------
const COMPANION_EXTENSION_IDS = ["ofbkinmakmfacepccjcbmjgecdppolki", "leads-automate@future-processing.com"];

chrome.runtime.onMessageExternal?.addListener((message, sender, sendResponse) => {
  if (!COMPANION_EXTENSION_IDS.includes(sender.id)) return;
  if (message?.action === "openPanel") {
    if (!Number.isInteger(message.tabId)) {
      sendResponse({ ok: false, error: "no tab given" });
      return;
    }
    chrome.tabs.sendMessage(message.tabId, { action: "lead-generator:show-panel" }, { frameId: 0 }).then(
      (result) => sendResponse({ ok: true, result }),
      (error) => sendResponse({ ok: false, error: error?.message || String(error) })
    );
    return true;
  }
  // In Chrome and Edge the panel answers the other actions itself.
  if (!RELAYS_COMPANION_REQUESTS || !Number.isInteger(message?.tabId)) return;
  relayCompanionRequest(message, sender.id).then(sendResponse);
  return true;
});

// -----------------------------
// COMPANION RELAY (Firefox only)
// Firefox gives the panel's framed page no runtime.onMessageExternal, so the
// panel connects a port here (companion-api.js) and Leads Automate's other
// requests (ping, extract, generateEmails, save) are passed to the panel of
// the tab they name; the panel checks them and runs them as in Chrome.
// getBrowserInfo exists only in Firefox.
// -----------------------------
const RELAYS_COMPANION_REQUESTS = typeof globalThis.browser?.runtime?.getBrowserInfo === "function";
// Same value as COMPANION_PORT_NAME in companion-api.js.
const COMPANION_PORT_NAME = "lead-generator:companion";
// How long a request waits for the tab's panel to connect: after this page
// was unloaded, the panels connect again within about a second.
const COMPANION_PANEL_WAIT_MS = 1500;
const PANEL_PAGE_URL = chrome.runtime.getURL("index.html");

// key: tabId, value: the port of that tab's panel
const companionPanels = new Map();
// key: requestId, value: { port, resolve }
const companionRequests = new Map();
let lastCompanionRequestId = 0;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== COMPANION_PORT_NAME) return;
  const tabId = port.sender?.tab?.id;
  // Only the panel page itself, framed in a tab.
  if (!Number.isInteger(tabId) || !port.sender.url?.startsWith(PANEL_PAGE_URL)) {
    port.disconnect();
    return;
  }
  companionPanels.set(tabId, port);

  port.onMessage.addListener(({ requestId, response }) => {
    const request = companionRequests.get(requestId);
    if (request?.port !== port) return;
    companionRequests.delete(requestId);
    request.resolve(response);
  });
  port.onDisconnect.addListener(() => {
    if (companionPanels.get(tabId) === port) companionPanels.delete(tabId);
    for (const [requestId, request] of companionRequests) {
      if (request.port !== port) continue;
      companionRequests.delete(requestId);
      request.resolve({ ok: false, error: "the Lead generator panel was closed" });
    }
  });
});

async function companionPanelPort(tabId) {
  const deadline = Date.now() + COMPANION_PANEL_WAIT_MS;
  while (!companionPanels.has(tabId) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return companionPanels.get(tabId) ?? null;
}

async function relayCompanionRequest(message, senderId) {
  const port = await companionPanelPort(message.tabId);
  if (!port) return { ok: false, error: "the Lead generator panel isn't open on that tab" };
  return new Promise((resolve) => {
    const requestId = ++lastCompanionRequestId;
    companionRequests.set(requestId, { port, resolve });
    try {
      port.postMessage({ requestId, senderId, message: { action: message.action, tabId: message.tabId } });
    } catch {
      companionRequests.delete(requestId);
      resolve({ ok: false, error: "the Lead generator panel was closed" });
    }
  });
}

// -----------------------------
// TAB BRIDGE
// Tab/scripting calls relayed from the panel where its framed page lacks
// those APIs (Firefox) - see src/scripts/services/tab-bridge.js.
// -----------------------------
async function handleTabBridgeRequest(message, sender) {
  switch (message.action) {
    case "tabBridge:getPanelTab":
      if (!sender.tab) throw new Error("Request did not come from a tab");
      return { id: sender.tab.id, url: sender.tab.url };
    case "tabBridge:injectScripts":
      await chrome.scripting.executeScript({ target: { tabId: message.tabId }, files: message.files });
      return null;
    case "tabBridge:sendMessageToTab":
      return chrome.tabs.sendMessage(message.tabId, message.message);
    case "tabBridge:openTab":
      await chrome.tabs.create({ url: message.url, active: true });
      return null;
    default:
      throw new Error(`Unknown tab bridge action: ${message.action}`);
  }
}

// -----------------------------
// WORKER FETCH (Firefox only)
// Firefox aborts network requests from the panel's framed extension page,
// so the panel relays its Cloudflare Worker requests here - see
// src/scripts/services/worker-client.js. Firefox's background is an event
// page, not a service worker, so the mid-request termination that keeps
// HTTP out of this file in Chrome doesn't apply. Chrome never sends this.
// -----------------------------
// Same value as WORKER_URL in src/constants/config.js (this classic script
// can't import it; a test keeps both in sync with manifest.json).
const WORKER_ORIGIN = "https://lead-generator-backend-worker.vitalij-musko.workers.dev";

async function handleWorkerFetch({ url, method, body }) {
  if (new URL(url).origin !== WORKER_ORIGIN) throw new Error("Only the extension's Worker may be fetched");

  const init = { method };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const response = await fetch(url, init);
  return response.json();
}

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

