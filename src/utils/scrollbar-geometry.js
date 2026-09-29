// Thumb size/position for a scrollbar whose track spans the scroll
// container's visible height.
export function computeScrollbarThumb({ scrollHeight, clientHeight, scrollTop }, minThumbHeight) {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 0 || clientHeight <= 0) return { visible: false, height: 0, top: 0 };

  const height = Math.min(clientHeight, Math.max(minThumbHeight, (clientHeight * clientHeight) / scrollHeight));
  const maxTop = clientHeight - height;
  const clampedScrollTop = Math.min(Math.max(scrollTop, 0), scrollable);
  const top = maxTop * (clampedScrollTop / scrollable);

  return { visible: true, height, top };
}

// How many pixels of content scroll correspond to one pixel of thumb drag.
export function dragScrollRatio({ scrollHeight, clientHeight }, thumbHeight) {
  const trackTravel = clientHeight - thumbHeight;
  if (trackTravel <= 0) return 0;
  return (scrollHeight - clientHeight) / trackTravel;
}
