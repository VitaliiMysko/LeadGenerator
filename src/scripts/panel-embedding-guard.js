// Defense-in-depth for the floating-panel iframe: manifest.json already
// restricts web_accessible_resources for index.html to linkedin.com pages
// (the actual, browser-enforced gate), but this keeps the page visually
// inert unless it also receives a handshake from the expected parent frame,
// in case something on linkedin.com other than our own content script ever
// loads it in a frame.
const INIT_MESSAGE_TYPE = "lead-generator:panel-init";
const PARENT_ORIGIN = "https://www.linkedin.com";

window.addEventListener("message", function onInit(event) {
  if (event.origin !== PARENT_ORIGIN) return;
  if (event.data?.type !== INIT_MESSAGE_TYPE) return;

  document.body.style.display = "";
  window.removeEventListener("message", onInit);
});
