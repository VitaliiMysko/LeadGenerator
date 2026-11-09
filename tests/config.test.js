import { readFileSync } from "node:fs";
import { WORKER_URL, COMPANION_EXTENSION_IDS } from "../src/constants/config.js";

const readRepoFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(readRepoFile("manifest.json"));

describe("WORKER_URL", () => {
  test("is one of the manifest's host_permissions", () => {
    // Firefox rejects a match pattern without a path, so the entry needs "/*".
    expect(manifest.host_permissions).toContain(`${WORKER_URL}/*`);
  });

  test("matches background.js's WORKER_ORIGIN", () => {
    const match = readRepoFile("src/scripts/workers/background.js").match(/const WORKER_ORIGIN = "([^"]+)"/);
    expect(match?.[1]).toBe(WORKER_URL);
  });
});

describe("COMPANION_EXTENSION_IDS", () => {
  test("matches background.js's COMPANION_EXTENSION_IDS", () => {
    const match = readRepoFile("src/scripts/workers/background.js").match(/const COMPANION_EXTENSION_IDS = (\[[^\]]*\]);/);
    expect(JSON.parse(match?.[1] ?? "null")).toEqual(COMPANION_EXTENSION_IDS);
  });
});

describe("COMPANION_PORT_NAME", () => {
  // Firefox: the panel connects to the background page by this name.
  test("is the same in companion-api.js and background.js", () => {
    const portName = (path) => readRepoFile(path).match(/const COMPANION_PORT_NAME = "([^"]+)";/)?.[1];
    const panelName = portName("src/scripts/containers/data/companion-api.js");
    expect(panelName).toBeTruthy();
    expect(portName("src/scripts/workers/background.js")).toBe(panelName);
  });
});
