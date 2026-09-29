import { readFileSync } from "node:fs";
import { WORKER_URL } from "../src/constants/config.js";

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

describe("WORKER_URL", () => {
  test("is one of the manifest's host_permissions", () => {
    expect(manifest.host_permissions).toContain(WORKER_URL);
  });
});
