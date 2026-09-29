import { computeScrollbarThumb, dragScrollRatio } from "../src/utils/scrollbar-geometry.js";

describe("computeScrollbarThumb", () => {
  test("is hidden when content doesn't overflow", () => {
    expect(computeScrollbarThumb({ scrollHeight: 300, clientHeight: 300, scrollTop: 0 }, 20)).toEqual({
      visible: false,
      height: 0,
      top: 0,
    });
    expect(computeScrollbarThumb({ scrollHeight: 200, clientHeight: 300, scrollTop: 0 }, 20).visible).toBe(false);
  });

  test("is hidden when the container has no height (e.g. panel not shown yet)", () => {
    expect(computeScrollbarThumb({ scrollHeight: 0, clientHeight: 0, scrollTop: 0 }, 20).visible).toBe(false);
  });

  test("sizes the thumb proportionally to the visible fraction", () => {
    expect(computeScrollbarThumb({ scrollHeight: 800, clientHeight: 400, scrollTop: 0 }, 20)).toEqual({
      visible: true,
      height: 200,
      top: 0,
    });
  });

  test("enforces the minimum thumb height", () => {
    expect(computeScrollbarThumb({ scrollHeight: 100000, clientHeight: 400, scrollTop: 0 }, 20).height).toBe(20);
  });

  test("positions the thumb at the bottom when fully scrolled", () => {
    expect(computeScrollbarThumb({ scrollHeight: 800, clientHeight: 400, scrollTop: 400 }, 20).top).toBe(200);
  });

  test("positions the thumb proportionally mid-scroll", () => {
    expect(computeScrollbarThumb({ scrollHeight: 800, clientHeight: 400, scrollTop: 100 }, 20).top).toBe(50);
  });

  test("clamps out-of-range scrollTop (e.g. elastic overscroll)", () => {
    expect(computeScrollbarThumb({ scrollHeight: 800, clientHeight: 400, scrollTop: -30 }, 20).top).toBe(0);
    expect(computeScrollbarThumb({ scrollHeight: 800, clientHeight: 400, scrollTop: 999 }, 20).top).toBe(200);
  });
});

describe("dragScrollRatio", () => {
  test("maps thumb travel onto content scroll range", () => {
    // 200px of thumb travel covers 400px of scrollable content.
    expect(dragScrollRatio({ scrollHeight: 800, clientHeight: 400 }, 200)).toBe(2);
  });

  test("is 0 when the thumb fills the track", () => {
    expect(dragScrollRatio({ scrollHeight: 400, clientHeight: 400 }, 400)).toBe(0);
  });
});
