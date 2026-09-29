import { computeScrollbarThumb, dragScrollRatio } from "../../utils/scrollbar-geometry.js";

const SCROLLBAR_WIDTH = 3;
const MIN_THUMB_HEIGHT = 20;
// Normal use (scrolling, dragging) stays well under this; exceeding it means
// updates are feeding back into layout, so the drawn scrollbar backs off.
const MAX_UPDATES_PER_SECOND = 120;

// Whether ::-webkit-scrollbar styling renders can't be feature-detected -
// browsers accept any ::-webkit-* selector for web compatibility - so it's
// measured. Appended to <html> because <body> starts hidden
// (panel-embedding-guard.js) and would measure 0.
function styledScrollbarRenders() {
  const probe = document.createElement("div");
  probe.className = "scrollbar-probe";
  document.documentElement.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width === SCROLLBAR_WIDTH;
}

// Where the styled scrollbar doesn't render (Firefox, whose native one can't
// be restyled or stopped from expanding on hover), hide the native scrollbar
// and draw a fixed 3px thumb instead. Chrome is left untouched.
export function applyScrollbarFallback(scrollElement) {
  if (!scrollElement || styledScrollbarRenders()) return;

  const host = scrollElement.parentElement;
  const thumb = document.createElement("div");
  thumb.className = "drawn-scrollbar-thumb";
  host.classList.add("drawn-scrollbar-host");
  scrollElement.classList.add("drawn-scrollbar");
  host.appendChild(thumb);

  const applied = {};
  function setStyle(property, value) {
    if (applied[property] === value) return;
    applied[property] = value;
    thumb.style[property] = value;
  }

  let frameRequested = false;
  let updatesInWindow = 0;
  let windowStart = performance.now();
  let disabled = false;

  function update() {
    frameRequested = false;
    if (disabled) return;

    const now = performance.now();
    if (now - windowStart > 1000) {
      windowStart = now;
      updatesInWindow = 0;
    }
    if (++updatesInWindow > MAX_UPDATES_PER_SECOND) {
      disable();
      return;
    }

    const { visible, height, top } = computeScrollbarThumb(scrollElement, MIN_THUMB_HEIGHT);
    setStyle("display", visible ? "block" : "none");
    if (!visible) return;
    setStyle("height", `${height}px`);
    setStyle("top", `${scrollElement.offsetTop + top}px`);
    setStyle("left", `${scrollElement.offsetLeft + scrollElement.offsetWidth - SCROLLBAR_WIDTH}px`);
  }

  function scheduleUpdate() {
    if (frameRequested || disabled) return;
    frameRequested = true;
    requestAnimationFrame(update);
  }

  const mutationObserver = new MutationObserver(scheduleUpdate);

  function disable() {
    disabled = true;
    mutationObserver.disconnect();
    thumb.remove();
    host.classList.remove("drawn-scrollbar-host");
    scrollElement.classList.remove("drawn-scrollbar");
    console.warn("Drawn scrollbar disabled: too many updates; falling back to the native scrollbar.");
  }

  scrollElement.addEventListener("scroll", scheduleUpdate, { passive: true });
  host.addEventListener("pointerenter", scheduleUpdate);
  window.addEventListener("resize", scheduleUpdate);
  // The thumb lives outside scrollElement, so its own style writes never
  // trigger this observer.
  mutationObserver.observe(scrollElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const startY = event.clientY;
    const startScrollTop = scrollElement.scrollTop;
    const ratio = dragScrollRatio(scrollElement, thumb.offsetHeight);
    thumb.setPointerCapture(event.pointerId);

    const onMove = (moveEvent) => {
      scrollElement.scrollTop = startScrollTop + (moveEvent.clientY - startY) * ratio;
    };
    const onUp = (upEvent) => {
      thumb.releasePointerCapture(upEvent.pointerId);
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
    };
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
  });

  scheduleUpdate();
}
