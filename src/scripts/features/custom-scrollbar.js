import { computeScrollbarThumb, dragScrollRatio } from "../../utils/scrollbar-geometry.js";

const SCROLLBAR_WIDTH = 3;
const MIN_THUMB_HEIGHT = 20;

// Measured rather than feature-detected: browsers accept any ::-webkit-*
// selector for web compatibility, so @supports / CSS.supports can't tell
// whether ::-webkit-scrollbar styling actually renders. Appended to <html>
// because <body> starts hidden (panel-embedding-guard.js) and would measure 0.
function nativeStyledScrollbarRenders() {
  const probe = document.createElement("div");
  probe.className = "scrollbar-probe";
  document.documentElement.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width === SCROLLBAR_WIDTH;
}

// Draws the Chrome-styled 3px scrollbar for browsers that can't style their
// native one (Firefox). Where ::-webkit-scrollbar works, it does nothing.
export function initCustomScrollbar(scrollElement) {
  if (!scrollElement || nativeStyledScrollbarRenders()) return;

  const host = scrollElement.parentElement;
  host.classList.add("custom-scrollbar-host");
  scrollElement.classList.add("custom-scrollbar");

  const thumb = document.createElement("div");
  thumb.className = "custom-scrollbar-thumb";
  host.appendChild(thumb);

  function update() {
    const { visible, height, top } = computeScrollbarThumb(scrollElement, MIN_THUMB_HEIGHT);
    thumb.style.display = visible ? "block" : "none";
    if (!visible) return;
    thumb.style.height = `${height}px`;
    thumb.style.top = `${scrollElement.offsetTop + top}px`;
    thumb.style.left = `${scrollElement.offsetLeft + scrollElement.offsetWidth - SCROLLBAR_WIDTH}px`;
  }

  scrollElement.addEventListener("scroll", update, { passive: true });
  // The container's own size, plus each tab inside it, since content
  // height changes (extraction, accordion expand) don't resize the container.
  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(scrollElement);
  for (const child of scrollElement.children) resizeObserver.observe(child);

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const startY = event.clientY;
    const startScrollTop = scrollElement.scrollTop;
    const ratio = dragScrollRatio(scrollElement, thumb.offsetHeight);
    thumb.setPointerCapture(event.pointerId);
    thumb.classList.add("dragging");

    const onMove = (moveEvent) => {
      scrollElement.scrollTop = startScrollTop + (moveEvent.clientY - startY) * ratio;
    };
    const onUp = (upEvent) => {
      thumb.releasePointerCapture(upEvent.pointerId);
      thumb.classList.remove("dragging");
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
    };
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
  });

  update();
}
