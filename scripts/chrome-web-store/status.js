// Chrome Web Store API v2 — publishers.items.fetchStatus:
// GET https://chromewebstore.googleapis.com/v2/publishers/{publisherId}/items/{extensionId}:fetchStatus
const IN_PROGRESS_STATES = new Set(["STATE_UNSPECIFIED", "UPLOAD_IN_PROGRESS", "IN_PROGRESS"]);

export async function fetchUploadStatus(client) {
  return client.request(`${client.itemPath}:fetchStatus`, { method: "GET" });
}

function extractState(status) {
  return status.uploadState ?? status.lastAsyncUploadState ?? null;
}

export async function pollUploadStatus(
  client,
  { intervalMs = 5000, timeoutMs = 120000, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), now = () => Date.now() } = {}
) {
  const deadline = now() + timeoutMs;

  while (true) {
    const status = await fetchUploadStatus(client);
    const state = extractState(status);

    if (state && !IN_PROGRESS_STATES.has(state)) {
      return status;
    }

    if (now() >= deadline) {
      throw new Error(
        `Timed out after ${timeoutMs}ms waiting for the Chrome Web Store upload to finish processing (last state: ${state ?? "UNKNOWN"})`
      );
    }

    await sleep(intervalMs);
  }
}
