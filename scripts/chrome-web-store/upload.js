// Chrome Web Store API v2 — media.upload:
// POST https://chromewebstore.googleapis.com/upload/v2/publishers/{publisherId}/items/{extensionId}:upload
export async function uploadPackage(client, zipBuffer) {
  return client.request(`${client.itemPath}:upload`, {
    method: "POST",
    upload: true,
    headers: { "Content-Type": "application/zip" },
    body: zipBuffer,
  });
}
