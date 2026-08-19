import { jest } from "@jest/globals";

const mockSyncGet = jest.fn();
const mockSyncSet = jest.fn();

jest.unstable_mockModule("../src/scripts/utils/chrome-storage.js", () => ({
  syncGet: mockSyncGet,
  syncSet: mockSyncSet,
}));

const { subscribe, getMaxSavedLeads, setMaxSavedLeads, loadMaxSavedLeads } = await import(
  "../src/scripts/store/max-leads-store.js"
);

const DEFAULT_MAX_SAVED_LEADS = 99;

// Tracks unsubscribe functions so each test cleans up its own listeners.
const cleanups = [];

beforeEach(async () => {
  mockSyncGet.mockReset();
  mockSyncSet.mockReset();
  mockSyncSet.mockResolvedValue(undefined);

  // Remove any listeners left over from the previous test before resetting state.
  cleanups.splice(0).forEach((fn) => fn());

  await setMaxSavedLeads(DEFAULT_MAX_SAVED_LEADS);

  // Clear call counts so assertions in tests only see their own calls.
  mockSyncSet.mockClear();
  mockSyncGet.mockClear();
});

describe("getMaxSavedLeads", () => {
  test("returns default value after reset", () => {
    expect(getMaxSavedLeads()).toBe(DEFAULT_MAX_SAVED_LEADS);
  });
});

describe("setMaxSavedLeads", () => {
  test("updates the stored value", async () => {
    await setMaxSavedLeads(500);
    expect(getMaxSavedLeads()).toBe(500);
  });

  test("overwrites previous value", async () => {
    await setMaxSavedLeads(500);
    await setMaxSavedLeads(9999);
    expect(getMaxSavedLeads()).toBe(9999);
  });

  test("persists the value to storage via syncSet", async () => {
    await setMaxSavedLeads(500);
    expect(mockSyncSet).toHaveBeenCalledWith("maxSavedLeads", 500);
  });

  test("syncSet is called once per setMaxSavedLeads call", async () => {
    await setMaxSavedLeads(500);
    expect(mockSyncSet).toHaveBeenCalledTimes(1);
  });
});

describe("subscribe", () => {
  test("listener is called when setMaxSavedLeads changes state", async () => {
    const listener = jest.fn();
    cleanups.push(subscribe(listener));

    await setMaxSavedLeads(500);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("listener receives the updated value", async () => {
    const listener = jest.fn();
    cleanups.push(subscribe(listener));

    await setMaxSavedLeads(500);

    expect(listener).toHaveBeenCalledWith(500);
  });

  test("multiple listeners are all called", async () => {
    const a = jest.fn();
    const b = jest.fn();
    cleanups.push(subscribe(a));
    cleanups.push(subscribe(b));

    await setMaxSavedLeads(500);

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  test("returned unsubscribe function removes the listener", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();

    await setMaxSavedLeads(500);

    expect(listener).not.toHaveBeenCalled();
  });

  test("unsubscribing one listener does not affect others", async () => {
    const a = jest.fn();
    const b = jest.fn();
    const unsubscribeA = subscribe(a);
    cleanups.push(subscribe(b));

    unsubscribeA();

    await setMaxSavedLeads(500);

    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});

describe("loadMaxSavedLeads", () => {
  test("restores value from storage", async () => {
    mockSyncGet.mockResolvedValue(250);

    await loadMaxSavedLeads();

    expect(getMaxSavedLeads()).toBe(250);
  });

  test("calls syncGet with the storage key and default value", async () => {
    mockSyncGet.mockResolvedValue(undefined);

    await loadMaxSavedLeads();

    expect(mockSyncGet).toHaveBeenCalledWith("maxSavedLeads", DEFAULT_MAX_SAVED_LEADS);
  });

  test("falls back to the default when storage is empty", async () => {
    mockSyncGet.mockResolvedValue(undefined);

    await loadMaxSavedLeads();

    expect(getMaxSavedLeads()).toBe(DEFAULT_MAX_SAVED_LEADS);
  });

  test("notifies listeners with the loaded value", async () => {
    const listener = jest.fn();
    cleanups.push(subscribe(listener));
    mockSyncGet.mockResolvedValue(250);

    await loadMaxSavedLeads();

    expect(listener).toHaveBeenCalledWith(250);
  });
});
