import { isOpenJobsKnown, formatOpenJobs } from "../src/utils/open-jobs.js";

describe("isOpenJobsKnown", () => {
  test("true and false are known", () => {
    expect(isOpenJobsKnown(true)).toBe(true);
    expect(isOpenJobsKnown(false)).toBe(true);
  });

  test("an unchecked value is not known", () => {
    expect(isOpenJobsKnown("")).toBe(false);
    expect(isOpenJobsKnown(undefined)).toBe(false);
    expect(isOpenJobsKnown(null)).toBe(false);
  });
});

describe("formatOpenJobs", () => {
  test("formats a checked value as a string", () => {
    expect(formatOpenJobs(true)).toBe("true");
    expect(formatOpenJobs(false)).toBe("false");
  });

  test("formats an unchecked value as an empty string", () => {
    expect(formatOpenJobs("")).toBe("");
    expect(formatOpenJobs(undefined)).toBe("");
    expect(formatOpenJobs(null)).toBe("");
  });
});
