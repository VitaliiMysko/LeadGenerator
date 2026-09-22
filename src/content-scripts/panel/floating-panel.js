window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.floatingPanelInit) {
  window.leadGenerator.floatingPanelInit = true;

  const PANEL_WIDTH = 400;
  const PANEL_HEIGHT = 500;

  let panelHost = null;
  let panelIframe = null;

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

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleFloatingPanel") {
      togglePanel();
    }
  });
}
