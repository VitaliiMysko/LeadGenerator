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
  return width === 3;
}

// Where it doesn't render (Firefox), switch to the standard scrollbar
// properties. Not applied everywhere: Chrome drops its ::-webkit-scrollbar
// styling once they're set.
export function applyScrollbarFallback(scrollElement) {
  if (!scrollElement || styledScrollbarRenders()) return;
  scrollElement.classList.add("standard-scrollbar");
}
