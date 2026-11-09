import { COMPANION_EXTENSION_IDS } from "../../../constants/config.js";
import { isCompanionRequest } from "../../../utils/companion.js";
import { trimAsciiWhitespace } from "../../../utils/text-utils.js";
import {
  getFirstNameElement,
  getSecondNameElement,
  getJobPositionElement,
  getCompanyNameElement,
  getCompanyDomainElement,
  getEmailElement,
} from "../../helper/dom-helper.js";
import { getPanelTab } from "../../services/tab-bridge.js";
import { generateLeadEmail } from "../../services/email.js";
import { extractLead } from "./extract-data.js";
import { saveCurrentLead } from "./storage-actions.js";

// Lets the Leads Automate extension run this panel's Extract, Generate and
// Save, the same actions as the buttons, for the lead it opened in people
// search. Only extensions in COMPANION_EXTENSION_IDS are answered (web
// pages can't message an extension at all), and only by the panel of the
// tab the request names. One request runs at a time.
//
// Firefox gives the panel framed in a LinkedIn page no
// runtime.onMessageExternal: there the panel connects a port to the
// background page, which takes Leads Automate's requests and passes on those
// for this panel's tab (see background.js, COMPANION RELAY).

// Same value as COMPANION_PORT_NAME in background.js.
const COMPANION_PORT_NAME = "lead-generator:companion";
// Pause before connecting again once the background page has unloaded.
const RECONNECT_DELAY_MS = 1000;

let ownTabId = null;
let running = false;

// The tab this panel is shown in.
async function isOwnTab(tabId) {
  if (ownTabId === null) {
    const current = await chrome.tabs?.getCurrent?.().catch(() => null);
    if (current?.id !== undefined) {
      ownTabId = current.id;
    } else {
      // No tab reported for the frame: only the visible page's panel answers.
      return document.visibilityState === "visible" && (await getPanelTab())?.id === tabId;
    }
  }
  return ownTabId === tabId;
}

function readLead() {
  return {
    firstName: getFirstNameElement().value,
    surname: getSecondNameElement().value,
    jobPosition: getJobPositionElement().value,
    companyName: getCompanyNameElement().value,
    website: trimAsciiWhitespace(getCompanyDomainElement()?.textContent ?? ""),
    email: getEmailElement().value,
  };
}

const ACTIONS = {
  ping: async () => ({ version: chrome.runtime.getManifest().version }),
  extract: async () => ({ ...(await extractLead()), lead: readLead() }),
  generateEmails: () => generateLeadEmail(),
  save: async () => ({ outcome: await saveCurrentLead() }),
};

// Runs one companion action and returns the reply for Leads Automate.
async function answer(action) {
  const exclusive = action !== "ping";
  if (exclusive && running) return { ok: false, error: "the Lead generator panel is busy" };
  if (exclusive) running = true;
  try {
    return { ok: true, result: await ACTIONS[action]() };
  } catch (error) {
    return { ok: false, error: error?.message || String(error) };
  } finally {
    if (exclusive) running = false;
  }
}

// Firefox: requests passed on by the background page, which sends only
// those for this panel's tab.
function connectRelay() {
  let port;
  try {
    port = chrome.runtime.connect({ name: COMPANION_PORT_NAME });
  } catch {
    // The extension was reloaded or removed: this page is left over.
    return;
  }
  port.onMessage.addListener(async ({ requestId, senderId, message }) => {
    const response = isCompanionRequest(message, senderId, COMPANION_EXTENSION_IDS)
      ? await answer(message.action)
      : { ok: false, error: "not a companion request" };
    try {
      port.postMessage({ requestId, response });
    } catch {
      // The background page unloaded meanwhile; the request is lost with it.
    }
  });
  // The background page unloaded (Firefox stops an idle event page):
  // connecting again starts it, so the next request finds this panel.
  port.onDisconnect.addListener(() => setTimeout(connectRelay, RECONNECT_DELAY_MS));
}

if (chrome.runtime.onMessageExternal) {
  chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (!isCompanionRequest(message, sender.id, COMPANION_EXTENSION_IDS)) return;

    isOwnTab(message.tabId).then(async (own) => {
      // Another tab's panel answers.
      if (!own) return;
      sendResponse(await answer(message.action));
    });
    return true;
  });
} else {
  connectRelay();
}
