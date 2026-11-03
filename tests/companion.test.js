import { isCompanionRequest, COMPANION_ACTIONS } from "../src/utils/companion.js";
import { COMPANION_EXTENSION_IDS } from "../src/constants/config.js";

const ALLOWED = ["ofbkinmakmfacepccjcbmjgecdppolki"];

describe("isCompanionRequest", () => {
  test.each(COMPANION_ACTIONS)("accepts %s from an allowed extension", (action) => {
    expect(isCompanionRequest({ action, tabId: 7 }, ALLOWED[0], ALLOWED)).toBe(true);
  });

  test("rejects other extensions", () => {
    expect(isCompanionRequest({ action: "save", tabId: 7 }, "abcdefghijklmnopabcdefghijklmnop", ALLOWED)).toBe(false);
    expect(isCompanionRequest({ action: "save", tabId: 7 }, undefined, ALLOWED)).toBe(false);
  });

  test("rejects unknown actions and messages without a tab", () => {
    expect(isCompanionRequest({ action: "clean", tabId: 7 }, ALLOWED[0], ALLOWED)).toBe(false);
    expect(isCompanionRequest({ action: "save" }, ALLOWED[0], ALLOWED)).toBe(false);
    expect(isCompanionRequest({ action: "save", tabId: "7" }, ALLOWED[0], ALLOWED)).toBe(false);
    expect(isCompanionRequest(null, ALLOWED[0], ALLOWED)).toBe(false);
  });
});

describe("COMPANION_EXTENSION_IDS", () => {
  test("are Chrome extension ids", () => {
    expect(COMPANION_EXTENSION_IDS.length).toBeGreaterThan(0);
    for (const id of COMPANION_EXTENSION_IDS) expect(id).toMatch(/^[a-p]{32}$/);
  });
});
