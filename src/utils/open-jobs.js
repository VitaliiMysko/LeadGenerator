// A company's open-jobs flag is true/false once checked and absent (or "")
// until then.
export function isOpenJobsKnown(hasOpenJobs) {
  return typeof hasOpenJobs === "boolean";
}

// Value saved with a lead: "true" / "false", or "" when not checked.
export function formatOpenJobs(hasOpenJobs) {
  return isOpenJobsKnown(hasOpenJobs) ? String(hasOpenJobs) : "";
}
