window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.floatingPanelInit) {
  window.leadGenerator.floatingPanelInit = true;

  const PANEL_WIDTH = 400;
  const PANEL_HEIGHT = 500;
  const RESET_MESSAGE_TYPE = "lead-generator:panel-reset";
  const INIT_MESSAGE_TYPE = "lead-generator:panel-init";
  const EXTENSION_ORIGIN = new URL(chrome.runtime.getURL("index.html")).origin;

  // Mirrors background.js's PANEL_ENABLED_URL_PATTERNS. Content scripts and
  // the service worker can't share modules, so this stays a small, separate
  // copy rather than a shared import.
  const SUPPORTED_PAGE_PATTERNS = [
    /^https:\/\/www\.linkedin\.com\/sales\/lead\//,
    /^https:\/\/www\.linkedin\.com\/in\//,
  ];

  let panelHost = null;
  let panelIframe = null;
  let lastKnownUrl = location.href;

  function isSupportedPageUrl(url) {
    return SUPPORTED_PAGE_PATTERNS.some((pattern) => pattern.test(url));
  }

  function createPanel() {
    panelHost = document.createElement("div");
    panelHost.id = "lead-generator-floating-panel";
    Object.assign(panelHost.style, {
      position: "fixed",
      top: "60px",
      right: "20px",
      width: `${PANEL_WIDTH}px`,
      height: `${PANEL_HEIGHT}px`,
      zIndex: "2147483647",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
      borderRadius: "6px",
      overflow: "hidden",
      background: "#fff",
    });

    panelIframe = document.createElement("iframe");
    panelIframe.src = chrome.runtime.getURL("index.html");
    Object.assign(panelIframe.style, {
      border: "none",
      width: "100%",
      height: "100%",
      display: "block",
    });
    panelIframe.addEventListener("load", () => {
      panelIframe.contentWindow.postMessage({ type: INIT_MESSAGE_TYPE }, EXTENSION_ORIGIN);
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close");
    Object.assign(closeButton.style, {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "22px",
      height: "22px",
      lineHeight: "20px",
      padding: "0",
      border: "none",
      borderRadius: "50%",
      background: "rgba(0, 0, 0, 0.6)",
      color: "#fff",
      fontSize: "14px",
      cursor: "pointer",
      zIndex: "1",
    });
    closeButton.addEventListener("click", hidePanel);

    panelHost.appendChild(panelIframe);
    panelHost.appendChild(closeButton);
    document.body.appendChild(panelHost);
  }

  function showPanel() {
    if (!panelHost) createPanel();
    panelHost.style.display = "block";
  }

  function hidePanel() {
    if (!panelHost) return;
    panelHost.style.display = "none";
  }

  function isPanelVisible() {
    return !!panelHost && panelHost.style.display !== "none";
  }

  function togglePanel() {
    if (isPanelVisible()) {
      hidePanel();
    } else {
      showPanel();
    }
  }

  function notifyPanelOfNavigation() {
    if (!isPanelVisible() || !panelIframe?.contentWindow) return;
    panelIframe.contentWindow.postMessage({ type: RESET_MESSAGE_TYPE }, EXTENSION_ORIGIN);
  }

  function handlePossibleNavigation() {
    const currentUrl = location.href;
    if (currentUrl === lastKnownUrl) return;
    lastKnownUrl = currentUrl;

    if (isSupportedPageUrl(currentUrl)) {
      notifyPanelOfNavigation();
    }
  }

  // LinkedIn is a single-page app: navigating between lead/profile pages
  // doesn't reload the tab. Wrapping history.pushState here would not work -
  // content scripts run in an isolated JS world, so the page's own pushState
  // calls never go through our wrapper. The Navigation API's events are DOM
  // events and do reach this world; polling is the fallback where it's absent.
  if (window.navigation) {
    window.navigation.addEventListener("currententrychange", handlePossibleNavigation);
  } else {
    setInterval(handlePossibleNavigation, 1000);
  }
  window.addEventListener("popstate", handlePossibleNavigation);

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleFloatingPanel") {
      togglePanel();
    }
  });
}
