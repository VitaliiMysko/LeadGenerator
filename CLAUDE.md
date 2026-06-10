# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a **vanilla JavaScript Chrome Extension (Manifest V3)** with no build system, transpiler, or package manager.

**To load the extension locally:**
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the repo root

**To apply changes:** click the reload icon on the extension card in `chrome://extensions/`, then reopen the popup.

There are no lint, test, or build commands — the source is deployed as-is.

## Documentation

Every task must include updates to all relevant `.md` files: `CHANGELOG.md`, `README.md`, `docs/architecture.md`, and `CLAUDE.md` if the architecture or workflow changes. `CHANGELOG.md` follows the existing versioning format.

## Architecture

The extension has two execution environments:

### Content Scripts (`src/content-scripts/`)
- Injected directly into LinkedIn pages (`sales/lead/*`, `company/*`)
- Extract DOM data and return it via Chrome messaging
- Must **not** make external network requests (CORS restriction)

### Popup UI (`src/scripts/`, `index.html`)
- Runs in the extension popup context
- Handles all user interaction, rendering, and state
- Makes **direct `fetch` calls** to external services (Cloudflare Worker backend) — do not route these through `background.js`

### Background Service Worker (`src/scripts/worker/background.js`)
- Used **only** for Chrome APIs requiring background context: `tabs` and `scripting`
- Responsible for opening company pages in background tabs and injecting content scripts to extract company data
- **Do not add HTTP requests here.** The MV3 service worker can be terminated mid-request, causing `null` responses via `sendMessage`. All network I/O belongs in the popup.

## Key Patterns

**Filter state (pub/sub):** `src/scripts/store/filter-store.js` is a mini state manager with `state`, `subscribe`, and `notify`. Filter UI components subscribe to it and re-render reactively. Filter state is persisted to Chrome Storage and restored on load.

**Tab system:** The right panel uses a show/hide pattern — all tab contents are in the DOM at once, toggled visible. Avoid full re-renders when switching tabs.

**New filters** go in `src/scripts/containers/filters/` using the existing pattern: a UI module that reads/writes through `filter-store.js`. Filters combine with AND logic.

**New button/action logic** goes in `src/scripts/containers/data/`.

**Storage actions** (`Save`/`Get`/`Clean`) live in `src/scripts/containers/data/storage-actions.js`. They use `chrome.storage.local` with key `saved_leads` (max 99 items, email is the unique key). The Get button copies all saved leads to the clipboard in tab-separated format (spreadsheet-friendly).

**New content scripts** go in `src/content-scripts/` and must be registered in `manifest.json` under `content_scripts`.

## External Services

All sensitive operations route through the Cloudflare Worker backend (URL in `manifest.json` host_permissions):
- Email validation via Emailable API
- Website availability checks
- Job title translation via Google Cloud Translation API (server-side API key stored in the Worker — never exposed to the client)

## Data Flow

1. User clicks "Extract" → popup sends message to content script on the active Sales Navigator lead page
2. Content script extracts profile data from DOM → returns to popup
3. Popup sends message to `background.js` to open company pages in background tabs
4. Background injects content scripts → extracts company data → returns to popup
5. Popup displays data; user can filter, translate, edit, generate/validate email, then copy
6. No extracted data is ever persisted — it lives only in popup memory and clipboard
