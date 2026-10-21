import {
  isOpenJobsKnown,
  hasMatchingOpenJob,
  getOpenJobsValue,
  serializeOpenJobTitles,
  parseOpenJobTitles,
  addKeywords,
} from "../src/utils/open-jobs.js";

const TITLES = ["Senior Java Developer", "Sales Manager", "Księgowa"];

describe("isOpenJobsKnown", () => {
  test("a list of titles is known, even when empty", () => {
    expect(isOpenJobsKnown(TITLES)).toBe(true);
    expect(isOpenJobsKnown([])).toBe(true);
  });

  test("an unchecked value is not known", () => {
    expect(isOpenJobsKnown(null)).toBe(false);
    expect(isOpenJobsKnown(undefined)).toBe(false);
    expect(isOpenJobsKnown("")).toBe(false);
  });
});

describe("hasMatchingOpenJob", () => {
  test("without keywords, any open job counts", () => {
    expect(hasMatchingOpenJob(TITLES, [])).toBe(true);
    expect(hasMatchingOpenJob([], [])).toBe(false);
  });

  test("matches a keyword contained in a title, ignoring case", () => {
    expect(hasMatchingOpenJob(TITLES, ["developer"])).toBe(true);
    expect(hasMatchingOpenJob(TITLES, ["JAVA"])).toBe(true);
  });

  test("matches when any one of several keywords is found", () => {
    expect(hasMatchingOpenJob(TITLES, ["designer", "sales"])).toBe(true);
  });

  test("matches non-Latin letters, ignoring case", () => {
    expect(hasMatchingOpenJob(TITLES, ["KSIĘGOWA"])).toBe(true);
  });

  test("is false when no title contains a keyword", () => {
    expect(hasMatchingOpenJob(TITLES, ["designer", "tester"])).toBe(false);
  });

  test("is false for a company without open jobs, whatever the keywords", () => {
    expect(hasMatchingOpenJob([], ["developer"])).toBe(false);
  });
});

describe("getOpenJobsValue", () => {
  test("returns 'true' / 'false' once the titles are known", () => {
    expect(getOpenJobsValue(TITLES, ["developer"])).toBe("true");
    expect(getOpenJobsValue(TITLES, ["designer"])).toBe("false");
    expect(getOpenJobsValue([], [])).toBe("false");
  });

  test("returns an empty string when the titles were not checked", () => {
    expect(getOpenJobsValue(null, [])).toBe("");
  });
});

describe("serializeOpenJobTitles / parseOpenJobTitles", () => {
  test("round-trips a list of titles", () => {
    expect(parseOpenJobTitles(serializeOpenJobTitles(TITLES))).toEqual(TITLES);
    expect(parseOpenJobTitles(serializeOpenJobTitles([]))).toEqual([]);
  });

  test("an unchecked value serializes to an empty string and parses back to null", () => {
    expect(serializeOpenJobTitles(null)).toBe("");
    expect(parseOpenJobTitles("")).toBeNull();
  });

  test("parses invalid or non-list values to null", () => {
    expect(parseOpenJobTitles("not json")).toBeNull();
    expect(parseOpenJobTitles("true")).toBeNull();
  });
});

describe("addKeywords", () => {
  test("adds a trimmed keyword", () => {
    expect(addKeywords([], "  developer ")).toEqual(["developer"]);
  });

  test("splits comma-separated input", () => {
    expect(addKeywords(["java"], "sales, designer")).toEqual(["java", "sales", "designer"]);
  });

  test("skips blanks and keywords already present, ignoring case", () => {
    expect(addKeywords(["Java"], "java, , ,JAVA")).toEqual(["Java"]);
  });

  test("does not modify the original list", () => {
    const keywords = ["java"];
    addKeywords(keywords, "sales");
    expect(keywords).toEqual(["java"]);
  });
});
