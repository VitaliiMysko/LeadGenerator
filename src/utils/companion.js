// Requests another extension (Leads Automate) may send to the panel through
// the companion API: ping, then Extract, Generate and Save, as the buttons.
export const COMPANION_ACTIONS = ["ping", "extract", "generateEmails", "save"];

// Whether a message from another extension is a companion request: from an
// allowed extension id, with a known action and the tab it's meant for.
export function isCompanionRequest(message, senderId, allowedIds) {
  return (
    allowedIds.includes(senderId) &&
    COMPANION_ACTIONS.includes(message?.action) &&
    Number.isInteger(message?.tabId)
  );
}
