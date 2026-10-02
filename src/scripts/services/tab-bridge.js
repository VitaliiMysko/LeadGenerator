// Firefox gives an extension page framed inside a web page only the
// content-script API subset, so chrome.tabs / chrome.scripting are missing in
// the panel there. In that case these calls are relayed to the background
// worker, which has them; in Chrome they are made directly.
export function hasTabApis() {
  return (
    typeof chrome.tabs?.query === "function" &&
    typeof chrome.scripting?.executeScript === "function"
  );
}

async function relay(message) {
  const response = await chrome.runtime.sendMessage(message);
  if (!response?.ok) throw new Error(response?.error || "Tab bridge request failed");
  return response.result;
}

export async function getPanelTab() {
  if (hasTabApis()) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  return relay({ action: "tabBridge:getPanelTab" });
}

export async function injectScripts(tabId, files) {
  if (hasTabApis()) {
    await chrome.scripting.executeScript({ target: { tabId }, files });
    return;
  }
  await relay({ action: "tabBridge:injectScripts", tabId, files });
}

export async function sendMessageToTab(tabId, message) {
  if (hasTabApis()) return chrome.tabs.sendMessage(tabId, message);
  return relay({ action: "tabBridge:sendMessageToTab", tabId, message });
}

export async function openTab(url) {
  if (hasTabApis()) {
    await chrome.tabs.create({ url, active: true });
    return;
  }
  await relay({ action: "tabBridge:openTab", url });
}
