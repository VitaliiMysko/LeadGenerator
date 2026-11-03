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
// Chrome and Edge only: Firefox gives the panel framed in a LinkedIn page no
// runtime.onMessageExternal.

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

chrome.runtime.onMessageExternal?.addListener((message, sender, sendResponse) => {
  if (!isCompanionRequest(message, sender.id, COMPANION_EXTENSION_IDS)) return;

  isOwnTab(message.tabId).then(async (own) => {
    // Another tab's panel answers.
    if (!own) return;
    const exclusive = message.action !== "ping";
    if (exclusive && running) {
      sendResponse({ ok: false, error: "the Lead generator panel is busy" });
      return;
    }
    if (exclusive) running = true;
    try {
      sendResponse({ ok: true, result: await ACTIONS[message.action]() });
    } catch (error) {
      sendResponse({ ok: false, error: error?.message || String(error) });
    } finally {
      if (exclusive) running = false;
    }
  });
  return true;
});
