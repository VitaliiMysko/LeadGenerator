import { RELEASE_NOTES } from "../../../constants/release-notes.js";
import { hasUnseenReleaseNotes, getReleaseHistory } from "../../../utils/release-notes.js";
import {
  RELEASE_NOTES_SEEN_KEY,
  getSeenReleaseNotesVersion,
  setSeenReleaseNotesVersion,
} from "../../store/release-notes-store.js";

const ITEM_LABELS = {
  added: "Added",
  changed: "Improved",
  fixed: "Fixed",
  removed: "Removed",
};

const currentVersion = chrome.runtime.getManifest().version;

const elements = {
  get button() { return document.getElementById("whats-new-btn"); },
  get version() { return document.getElementById("app-version"); },
  get dialog() { return document.getElementById("whats-new-dialog"); },
  get list() { return document.getElementById("whats-new-list"); },
  get close() { return document.getElementById("whats-new-close"); },
  get ok() { return document.getElementById("whats-new-ok"); },
};

function updateButton(seenVersion) {
  elements.button.hidden = !hasUnseenReleaseNotes(seenVersion, currentVersion);
}

function renderRelease(release, expand) {
  const details = document.createElement("details");
  details.className = "whats-new-release";
  details.open = expand;

  const summary = document.createElement("summary");
  const version = document.createElement("span");
  version.className = "whats-new-version";
  version.textContent = `v${release.version}`;
  const date = document.createElement("span");
  date.className = "whats-new-date";
  date.textContent = release.date;
  summary.append(version, date);
  if (release.isNew) {
    const tag = document.createElement("span");
    tag.className = "whats-new-tag";
    tag.textContent = "New";
    summary.appendChild(tag);
  }

  const items = document.createElement("ul");
  for (const item of release.items) {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.className = `whats-new-item-type whats-new-item-${item.type}`;
    label.textContent = ITEM_LABELS[item.type];
    const text = document.createElement("span");
    text.textContent = item.text;
    li.append(label, text);
    items.appendChild(li);
  }

  details.append(summary, items);
  return details;
}

async function openDialog() {
  const seenVersion = await getSeenReleaseNotesVersion();
  const history = getReleaseHistory(RELEASE_NOTES, seenVersion, currentVersion);
  // New releases are expanded; with none (browsing history), the latest is.
  const anyNew = history.some((release) => release.isNew);

  elements.list.replaceChildren(
    ...history.map((release, index) => renderRelease(release, release.isNew || (!anyNew && index === 0)))
  );
  elements.list.scrollTop = 0;
  elements.dialog.hidden = false;
}

async function closeDialog() {
  elements.dialog.hidden = true;
  await setSeenReleaseNotesVersion(currentVersion);
}

export async function initWhatsNew() {
  if (!elements.button || !elements.dialog) return;

  elements.button.addEventListener("click", openDialog);
  elements.version.addEventListener("click", openDialog);
  elements.close.addEventListener("click", closeDialog);
  elements.ok.addEventListener("click", closeDialog);
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) closeDialog();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.dialog.hidden) closeDialog();
  });

  // Closing the dialog in another tab's panel hides the marker here too.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && RELEASE_NOTES_SEEN_KEY in changes) {
      updateButton(changes[RELEASE_NOTES_SEEN_KEY].newValue);
    }
  });

  updateButton(await getSeenReleaseNotesVersion());
}
