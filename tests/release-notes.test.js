import { readFileSync } from "node:fs";
import {
  compareVersions,
  hasUnseenReleaseNotes,
  isNewRelease,
  getReleaseHistory,
} from "../src/utils/release-notes.js";
import { RELEASE_NOTES } from "../src/constants/release-notes.js";
import { RELEASE_NOTES_SEEN_KEY } from "../src/scripts/store/release-notes-store.js";

const readRepoFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(readRepoFile("manifest.json"));

describe("compareVersions", () => {
  test("compares each part numerically", () => {
    expect(compareVersions("3.10.0", "3.9.2")).toBeGreaterThan(0);
    expect(compareVersions("3.4.1", "3.5.0")).toBeLessThan(0);
    expect(compareVersions("3.7.1", "3.7.1")).toBe(0);
  });

  test("treats missing parts as 0", () => {
    expect(compareVersions("3.7", "3.7.0")).toBe(0);
    expect(compareVersions("3.7", "3.7.1")).toBeLessThan(0);
  });
});

describe("hasUnseenReleaseNotes", () => {
  test("is false once the installed version's notes were seen", () => {
    expect(hasUnseenReleaseNotes("3.8.0", "3.8.0")).toBe(false);
  });

  test("is true after an update or when nothing is recorded", () => {
    expect(hasUnseenReleaseNotes("3.7.1", "3.8.0")).toBe(true);
    expect(hasUnseenReleaseNotes(undefined, "3.8.0")).toBe(true);
  });
});

describe("isNewRelease", () => {
  test("marks every release after the seen one up to the installed one", () => {
    expect(isNewRelease("3.8.0", "3.6.0", "3.8.0")).toBe(true);
    expect(isNewRelease("3.7.0", "3.6.0", "3.8.0")).toBe(true);
    expect(isNewRelease("3.6.0", "3.6.0", "3.8.0")).toBe(false);
    expect(isNewRelease("3.5.0", "3.6.0", "3.8.0")).toBe(false);
  });

  test("never marks a release newer than the installed one", () => {
    expect(isNewRelease("3.9.0", "3.6.0", "3.8.0")).toBe(false);
  });

  test("with nothing recorded, marks only the installed release", () => {
    expect(isNewRelease("3.8.0", undefined, "3.8.0")).toBe(true);
    expect(isNewRelease("3.7.1", undefined, "3.8.0")).toBe(false);
  });
});

describe("getReleaseHistory", () => {
  const notes = [
    { version: "3.9.0", items: [] },
    { version: "3.8.0", items: [] },
    { version: "3.7.0", items: [] },
  ];

  test("lists releases up to the installed one, flagging the new ones", () => {
    expect(getReleaseHistory(notes, "3.7.0", "3.8.0")).toEqual([
      { version: "3.8.0", items: [], isNew: true },
      { version: "3.7.0", items: [], isNew: false },
    ]);
  });

  test("flags nothing once the installed version's notes were seen", () => {
    expect(getReleaseHistory(notes, "3.8.0", "3.8.0").some((r) => r.isNew)).toBe(false);
  });
});

describe("RELEASE_NOTES", () => {
  test("has an entry for the manifest version, first", () => {
    expect(RELEASE_NOTES[0].version).toBe(manifest.version);
  });

  test("is sorted newest first without duplicate versions", () => {
    for (let i = 1; i < RELEASE_NOTES.length; i++) {
      expect(compareVersions(RELEASE_NOTES[i - 1].version, RELEASE_NOTES[i].version)).toBeGreaterThan(0);
    }
  });

  test("each release has a date and at least one typed, non-empty item", () => {
    const types = ["added", "changed", "fixed", "removed"];
    for (const release of RELEASE_NOTES) {
      expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(release.items.length).toBeGreaterThan(0);
      for (const item of release.items) {
        expect(types).toContain(item.type);
        expect(item.text.length).toBeGreaterThan(0);
      }
    }
  });

  test("has exactly the released versions of CHANGELOG.md, with the same dates", () => {
    const changelog = readRepoFile("CHANGELOG.md");
    const released = [...changelog.matchAll(/^## \[(\d[^\]]*)\] - (\d{4}-\d{2}-\d{2})/gm)].map(
      ([, version, date]) => ({ version, date })
    );
    expect(RELEASE_NOTES.map(({ version, date }) => ({ version, date }))).toEqual(released);
  });
});

describe("RELEASE_NOTES_SEEN_KEY", () => {
  // The launcher and the background can't import the panel's module, so
  // they repeat the storage key.
  test.each(["src/content-scripts/panel/floating-panel.js", "src/scripts/workers/background.js"])(
    "is the same in %s",
    (path) => {
      expect(readRepoFile(path)).toContain(`const RELEASE_NOTES_SEEN_KEY = "${RELEASE_NOTES_SEEN_KEY}";`);
    }
  );
});
