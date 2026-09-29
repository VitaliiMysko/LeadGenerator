import { readFileSync } from "node:fs";
import { WORKER_URL } from "../src/constants/config.js";

const readRepoFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(readRepoFile("manifest.json"));

describe("WORKER_URL", () => {
  test("is one of the manifest's host_permissions", () => {
    expect(manifest.host_permissions).toContain(WORKER_URL);
  });

  test("matches background.js's WORKER_ORIGIN", () => {
    const match = readRepoFile("src/scripts/workers/background.js").match(/const WORKER_ORIGIN = "([^"]+)"/);
    expect(match?.[1]).toBe(WORKER_URL);
  });
});
