import { hasTabApis } from "./tab-bridge.js";

// Firefox loads the panel's framed extension page as unprivileged web
// content and aborts its network requests, so there Worker requests are
// relayed to the background page. In Chrome they stay in the panel: its
// background is a service worker that can be terminated mid-request.
// Firefox is detected the same way as in tab-bridge.js.
export async function fetchWorkerJson(url, { method = "GET", body } = {}) {
  if (hasTabApis()) {
    const init = { method };
    if (body !== undefined) {
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(body);
    }
    const response = await fetch(url, init);
    return response.json();
  }

  const response = await chrome.runtime.sendMessage({ action: "workerFetch", url, method, body });
  if (!response?.ok) throw new Error(response?.error || "Worker request failed");
  return response.result;
}
