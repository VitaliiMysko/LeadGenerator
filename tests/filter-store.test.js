import { jest } from "@jest/globals";

const mockSyncGet = jest.fn();
const mockSyncSet = jest.fn();

jest.unstable_mockModule("../src/scripts/utils/chrome-storage.js", () => ({
  syncGet: mockSyncGet,
  syncSet: mockSyncSet,
}));

const { subscribe, getState, setFilter, loadFilters } = await import(
  "../src/scripts/store/filter-store.js"
);

// Tracks unsubscribe functions so each test cleans up its own listeners.
const cleanups = [];

beforeEach(async () => {
  mockSyncGet.mockReset();
  mockSyncSet.mockReset();
  mockSyncSet.mockResolvedValue(undefined);

  // Remove any listeners left over from the previous test before resetting state.
  cleanups.splice(0).forEach((fn) => fn());

  await setFilter("companyLocation", []);
  await setFilter("companySize", []);

  // Clear call counts so assertions in tests only see their own calls.
  mockSyncSet.mockClear();
  mockSyncGet.mockClear();
});

describe("getState", () => {
  test("returns default state after reset", () => {
    expect(getState()).toEqual({ companyLocation: [], companySize: [] });
  });
});

describe("setFilter", () => {
  test("updates the specified key in state", async () => {
    await setFilter("companyLocation", ["Germany"]);
    expect(getState().companyLocation).toEqual(["Germany"]);
  });

  test("does not affect other keys", async () => {
    await setFilter("companyLocation", ["Germany"]);
    expect(getState().companySize).toEqual([]);
  });

  test("overwrites previous value for the same key", async () => {
    await setFilter("companyLocation", ["Germany"]);
    await setFilter("companyLocation", ["Poland"]);
    expect(getState().companyLocation).toEqual(["Poland"]);
  });

  test("persists state to storage via syncSet", async () => {
    await setFilter("companyLocation", ["Germany"]);
    expect(mockSyncSet).toHaveBeenCalledWith("filters", expect.objectContaining({ companyLocation: ["Germany"] }));
  });

  test("syncSet is called once per setFilter call", async () => {
    await setFilter("companyLocation", ["Germany"]);
    expect(mockSyncSet).toHaveBeenCalledTimes(1);
  });
});

describe("subscribe", () => {
  test("listener is called when setFilter changes state", async () => {
    const listener = jest.fn();
    cleanups.push(subscribe(listener));

    await setFilter("companyLocation", ["Germany"]);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("listener receives updated state", async () => {
    const listener = jest.fn();
    cleanups.push(subscribe(listener));

    await setFilter("companyLocation", ["Germany"]);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ companyLocation: ["Germany"] }),
    );
  });

  test("multiple listeners are all called", async () => {
    const a = jest.fn();
    const b = jest.fn();
    cleanups.push(subscribe(a));
    cleanups.push(subscribe(b));

    await setFilter("companySize", ["11-50"]);

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  test("returned unsubscribe function removes the listener", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();

    await setFilter("companyLocation", ["Germany"]);

    expect(listener).not.toHaveBeenCalled();
  });

  test("unsubscribing one listener does not affect others", async () => {
    const a = jest.fn();
    const b = jest.fn();
    const unsubscribeA = subscribe(a);
    cleanups.push(subscribe(b));

    unsubscribeA();

    await setFilter("companyLocation", ["Germany"]);

    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});

describe("loadFilters", () => {
  test("restores state from storage", async () => {
    const saved = { companyLocation: ["Germany"], companySize: ["11-50"] };
    mockSyncGet.mockResolvedValue(saved);

    await loadFilters();

    expect(getState()).toEqual(saved);
  });

  test("calls syncGet with the filters storage key", async () => {
    mockSyncGet.mockResolvedValue(undefined);

    await loadFilters();

    expect(mockSyncGet).toHaveBeenCalledWith("filters");
  });

  test("leaves state unchanged when storage is empty", async () => {
    mockSyncGet.mockResolvedValue(undefined);

    await loadFilters();

    expect(getState()).toEqual({ companyLocation: [], companySize: [] });
  });
});
