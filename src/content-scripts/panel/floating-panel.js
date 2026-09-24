window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.floatingPanelInit) {
  window.leadGenerator.floatingPanelInit = true;

  const PANEL_WIDTH = 400;
  const PANEL_HEIGHT = 500;
  const LAUNCHER_SIZE = 44;
  const EDGE_GAP = 8;
  const DRAG_THRESHOLD = 4;
  const LAUNCHER_POSITION_KEY = "floatingLauncherPosition";
  const RESET_MESSAGE_TYPE = "lead-generator:panel-reset";
  const INIT_MESSAGE_TYPE = "lead-generator:panel-init";
  const EXTENSION_ORIGIN = new URL(chrome.runtime.getURL("index.html")).origin;

  // Pages a lead is extracted from; landing on a different one resets the
  // panel's displayed fields.
  const EXTRACTABLE_PAGE_PATTERNS = [
    /^https:\/\/www\.linkedin\.com\/sales\/lead\//,
    /^https:\/\/www\.linkedin\.com\/in\//,
  ];

  // Pages the launcher is shown on. Mirrors background.js's
  // PANEL_ENABLED_URL_PATTERNS - content scripts and the service worker can't
  // share modules, so this stays a small, separate copy.
  const SUPPORTED_PAGE_PATTERNS = [
    ...EXTRACTABLE_PAGE_PATTERNS,
    /^https:\/\/www\.linkedin\.com\/sales\/search\/people/,
  ];

  let launcher = null;
  let launcherPosition = null;
  let panelHost = null;
  let panelIframe = null;
  let lastKnownUrl = location.href;

  function isSupportedPageUrl(url) {
    return SUPPORTED_PAGE_PATTERNS.some((pattern) => pattern.test(url));
  }

  function isExtractablePageUrl(url) {
    return EXTRACTABLE_PAGE_PATTERNS.some((pattern) => pattern.test(url));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
  }

  function viewportSize() {
    return { width: document.documentElement.clientWidth, height: window.innerHeight };
  }

  function defaultLauncherPosition() {
    const { width, height } = viewportSize();
    return { left: width - LAUNCHER_SIZE - 24, top: Math.round(height / 2 - LAUNCHER_SIZE / 2) };
  }

  function clampLauncherPosition({ left, top }) {
    const { width, height } = viewportSize();
    return {
      left: clamp(left, EDGE_GAP, width - LAUNCHER_SIZE - EDGE_GAP),
      top: clamp(top, EDGE_GAP, height - LAUNCHER_SIZE - EDGE_GAP),
    };
  }

  function applyLauncherPosition() {
    launcherPosition = clampLauncherPosition(launcherPosition);
    launcher.style.left = `${launcherPosition.left}px`;
    launcher.style.top = `${launcherPosition.top}px`;
    if (isPanelVisible()) positionPanel();
  }

  // Open the panel beside the launcher: to its left when there's room
  // (the launcher defaults to the right edge), otherwise to its right,
  // always clamped inside the viewport.
  function positionPanel() {
    const { width, height } = viewportSize();
    const { left: iconLeft, top: iconTop } = launcherPosition;

    let left = iconLeft - PANEL_WIDTH - EDGE_GAP;
    if (left < EDGE_GAP) left = iconLeft + LAUNCHER_SIZE + EDGE_GAP;
    left = clamp(left, EDGE_GAP, width - PANEL_WIDTH - EDGE_GAP);
    const top = clamp(iconTop, EDGE_GAP, height - PANEL_HEIGHT - EDGE_GAP);

    panelHost.style.left = `${left}px`;
    panelHost.style.top = `${top}px`;
  }

  function createLauncher() {
    launcher = document.createElement("div");
    launcher.id = "lead-generator-launcher";
    launcher.title = "Lead generator";
    Object.assign(launcher.style, {
      position: "fixed",
      width: `${LAUNCHER_SIZE}px`,
      height: `${LAUNCHER_SIZE}px`,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "grab",
      userSelect: "none",
      touchAction: "none",
      zIndex: "2147483647",
    });

    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("assets/icons/logo-32.png");
    icon.alt = "Lead generator";
    icon.draggable = false;
    Object.assign(icon.style, { width: "32px", height: "32px", pointerEvents: "none" });
    launcher.appendChild(icon);

    let dragStart = null;

    launcher.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      dragStart = {
        x: event.clientX,
        y: event.clientY,
        left: launcherPosition.left,
        top: launcherPosition.top,
        moved: false,
      };
      // Capture keeps pointer events on the launcher even when the pointer
      // passes over the panel's iframe mid-drag.
      launcher.setPointerCapture(event.pointerId);
      launcher.style.cursor = "grabbing";
    });

    launcher.addEventListener("pointermove", (event) => {
      if (!dragStart) return;
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      if (!dragStart.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragStart.moved = true;
      launcherPosition = { left: dragStart.left + dx, top: dragStart.top + dy };
      applyLauncherPosition();
    });

    launcher.addEventListener("pointerup", (event) => {
      if (!dragStart) return;
      const wasDrag = dragStart.moved;
      dragStart = null;
      launcher.releasePointerCapture(event.pointerId);
      launcher.style.cursor = "grab";

      if (wasDrag) {
        chrome.storage.local.set({ [LAUNCHER_POSITION_KEY]: launcherPosition });
      } else {
        togglePanel();
      }
    });

    document.body.appendChild(launcher);
    applyLauncherPosition();
  }

  function createPanel() {
    panelHost = document.createElement("div");
    panelHost.id = "lead-generator-floating-panel";
    Object.assign(panelHost.style, {
      position: "fixed",
      width: `${PANEL_WIDTH}px`,
      height: `${PANEL_HEIGHT}px`,
      zIndex: "2147483646",
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
    if (!launcher) return;
    if (!panelHost) createPanel();
    panelHost.style.display = "block";
    positionPanel();
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

  // The launcher (and with it the panel) exists only on supported pages;
  // navigating elsewhere within LinkedIn hides both until the user comes back.
  function updateLauncherVisibility() {
    if (!launcher) return;
    if (isSupportedPageUrl(location.href)) {
      launcher.style.display = "flex";
    } else {
      launcher.style.display = "none";
      hidePanel();
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

    updateLauncherVisibility();
    // Not on every supported page: search result URLs change with every
    // filter/page change, which must not wipe what the user extracted.
    if (isExtractablePageUrl(currentUrl)) {
      notifyPanelOfNavigation();
    }
  }

  async function init() {
    const stored = await chrome.storage.local.get(LAUNCHER_POSITION_KEY);
    launcherPosition = stored[LAUNCHER_POSITION_KEY] || defaultLauncherPosition();
    createLauncher();
    updateLauncherVisibility();
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

  window.addEventListener("resize", () => {
    if (launcher) applyLauncherPosition();
  });

  // The toolbar icon still toggles the panel too, as a fallback.
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleFloatingPanel") {
      togglePanel();
    }
  });

  init();
}
