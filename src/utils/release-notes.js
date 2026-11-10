// Pure helpers for the "What's new" dialog: which releases the user
// hasn't seen yet.

// Compares dotted numeric versions ("3.10.0" > "3.9.2"). Missing parts
// count as 0. Returns a negative number, 0 or a positive number.
export function compareVersions(a, b) {
  const partsA = String(a).split(".").map(Number);
  const partsB = String(b).split(".").map(Number);
  const length = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < length; i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// The "What's new" marker shows until the dialog is closed on this version.
export function hasUnseenReleaseNotes(seenVersion, currentVersion) {
  return seenVersion !== currentVersion;
}

// Whether a release is new to the user: newer than the version whose notes
// they last closed, and not newer than the installed one. With nothing
// recorded (an update from a version before "What's new"), only the
// installed version counts as new.
export function isNewRelease(version, seenVersion, currentVersion) {
  if (compareVersions(version, currentVersion) > 0) return false;
  if (!seenVersion) return compareVersions(version, currentVersion) === 0;
  return compareVersions(version, seenVersion) > 0;
}

// Releases to list, newest first, each flagged as new or not. Notes for
// versions newer than the installed one are left out.
export function getReleaseHistory(releaseNotes, seenVersion, currentVersion) {
  return releaseNotes
    .filter((release) => compareVersions(release.version, currentVersion) <= 0)
    .map((release) => ({ ...release, isNew: isNewRelease(release.version, seenVersion, currentVersion) }));
}
