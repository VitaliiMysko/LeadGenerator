# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a **vanilla JavaScript Chrome Extension (Manifest V3)** with no build system or transpiler.

**To load the extension locally:**
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the repo root

**To apply changes:** click the reload icon on the extension card in `chrome://extensions/`, then reopen the popup.

There are no lint or build commands — the source is deployed as-is.

### Tests

The project uses **Jest** for unit testing pure logic. Install once after cloning, then run:

```
npm install
npm test
```

Tests live in `tests/` and import from `src/utils/` (pure utility modules with no DOM or Chrome API dependencies).

**When to add a test:** any new pure function (no DOM, no `chrome.*`, no `fetch`) should have a test. Extract it to `src/utils/` first, import it back in the original module, then test the utility directly.

Modules whose only browser dependency is `chrome.storage` (no DOM, no `chrome.tabs`/`scripting`/`runtime`) can also be tested: mock the `chrome-storage.js` wrapper with `jest.unstable_mockModule` before dynamically importing the module under test (see `tests/filter-store.test.js` as the reference pattern).

**What not to test:** content scripts, DOM manipulation, and `fetch`-based services — these require a real browser environment and are verified manually.

### CI/CD

Tests run automatically on GitHub Actions on every push to `master` and every PR targeting `master` (`.github/workflows/test.yml`). The `master` branch is protected — a PR cannot be merged until the `test` check passes. Never bypass this check.

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

### Background Service Worker (`src/scripts/workers/background.js`)
- Used **only** for Chrome APIs requiring background context: `tabs` and `scripting`
- Responsible for opening company pages in background tabs and injecting content scripts to extract company data
- **Do not add HTTP requests here.** The MV3 service worker can be terminated mid-request, causing `null` responses via `sendMessage`. All network I/O belongs in the popup.

## Key Patterns

**Filter state (pub/sub):** `src/scripts/store/filter-store.js` is a mini state manager with `state`, `subscribe`, and `notify`. Filter UI components subscribe to it and re-render reactively. Filter state is persisted to Chrome Storage and restored on load.

**Max saved leads (pub/sub):** `src/scripts/store/max-leads-store.js` follows the same `state`/`subscribe`/`notify` pattern as `filter-store.js`, holding the user-configurable max-saved-leads limit (`chrome.storage.sync` key `maxSavedLeads`, default 99, hard cap 9999 from `MAX_SAVED_LEADS_LIMIT` in `src/constants/config.js`). `storage-actions.js` subscribes to it to keep the Save button, counter, and progress bar in sync when the limit changes.

**Tab system:** The right panel uses a show/hide pattern — all tab contents are in the DOM at once, toggled visible. Avoid full re-renders when switching tabs.

**New filters** go in `src/scripts/containers/filters/` using the existing pattern: a UI module that reads/writes through `filter-store.js`. Filters combine with AND logic.

**New button/action logic** goes in `src/scripts/containers/data/`.

**Storage actions** (`Save`/`Get`/`Clean`) live in `src/scripts/containers/data/storage-actions.js`. They use `chrome.storage.local` with key `saved_leads` (email is the unique key). The max item count is user-configurable via the "Max saved leads" setting (`src/scripts/containers/settings/max-saved-leads.js`, 1-9999, default 99); lowering it below the current saved count prompts for confirmation before deleting the oldest leads. The Get button copies all saved leads to the clipboard in tab-separated format (spreadsheet-friendly).

**Persistent company data cache:** `src/scripts/store/company-cache-store.js` caches the last `MAX_CACHED_COMPANIES` (10, from `src/constants/config.js`) companies whose details were successfully fetched from their LinkedIn page, in `chrome.storage.local` key `cachedCompanies`, keyed by company id (`extractCompanyId(companyLink)` from `src/utils/company-id.js`), with the company name also stored on each entry. List/eviction logic is a pure, unit-tested helper in `src/utils/company-cache.js` (`upsertCompanyCacheEntry`, `findCompanyCacheEntry`, `removeCompanyCacheEntry`, `updateCompanyCacheEntryWebsite`). `company-data.js`'s `getCompanyData()` checks this persistent cache (after its popup-lifetime in-memory Map) before opening a background tab to re-scrape a company page, so the same company isn't re-fetched across popup sessions. When the selected company has no LinkedIn link (so no company id), lookups fall back to matching by company name instead. Editing a company's website inline (`handleDomainSave` in `company-details.js`) calls `updateCompanyWebsite()` to keep the cached entry's website field current. The refresh button (↻) `await`s clearing a company's persistent cache entry (via `clearCompanyCache`, itself `async`) before re-fetching — clearing must be awaited, since an unawaited `chrome.storage.local` removal can still be in flight when the next lookup runs, causing it to read the stale entry.

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
6. No lead data is ever persisted automatically — it lives only in popup memory and clipboard unless the user explicitly clicks Save. Fetched company details (website, location, industry, size, members) are the one exception: they are cached in `chrome.storage.local` (last 10 companies, keyed by company id) purely to avoid redundant re-fetches — see "Persistent company data cache" above
