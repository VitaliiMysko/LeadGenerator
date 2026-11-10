import { localGet, localSet } from "../utils/chrome-storage.js";

// Version whose "What's new" notes the user last closed. Also read by the
// launcher (floating-panel.js) and set on install by background.js.
export const RELEASE_NOTES_SEEN_KEY = "releaseNotesSeenVersion";

export function getSeenReleaseNotesVersion() {
  return localGet(RELEASE_NOTES_SEEN_KEY);
}

export function setSeenReleaseNotesVersion(version) {
  return localSet(RELEASE_NOTES_SEEN_KEY, version);
}
