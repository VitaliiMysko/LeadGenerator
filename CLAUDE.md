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
- **Name/surname cleanup** (`lead.js`'s `handleFullName`/`getSecondName`): when matching "is this character part of the name", use the Unicode `\p{L}` letter property (with the `u` regex flag) instead of a hand-picked character range (e.g. `a-zA-ZÀ-ſ`) — a narrower range silently drops any letter that falls outside it (this happened for some diacritic letters, e.g. Romanian "Ș").
- **Name heading may be visually truncated**: `getFullNameText()` in `lead.js` reads the lead heading's `aria-label`/`title` in addition to `textContent`, preferring whichever is longest, since LinkedIn's narrow Sales Navigator panel can JS-truncate the visible heading text while the full name stays available via those attributes for accessibility.

### Popup UI (`src/scripts/`, `index.html`)
- Runs in the extension popup context
- Handles all user interaction, rendering, and state
- Makes **direct `fetch` calls** to external services (Cloudflare Worker backend) — do not route these through `background.js`
- **`libs/transliteration/bundle.umd.min.js` is loaded as a classic, non-module `<script>`** (not imported), so any globals it patches for browser compatibility apply to the whole popup page. Its bundled core-js `trim` polyfill mishandles some Latin Extended-A letters at the end of a string as trimmable whitespace and silently deletes them (e.g. `"Miha Kampuš".trim()` → `"Miha Kampu"`) — it also patches `String.prototype.replace`/`RegExp.prototype.exec`. **Do not call `String.prototype.trim()` (or a regex-based replace) anywhere in `src/scripts/` on values that may contain non-ASCII letters** — use `trimAsciiWhitespace()` from `src/utils/text-utils.js` instead, which only uses `charCodeAt()`/`slice()`. This is scoped to the popup only: content scripts (`src/content-scripts/`) run in the LinkedIn page's own JS realm, which never loads that bundle, so `.trim()` there is unaffected.

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

**Inline website editor:** `src/scripts/features/website-domain-editor.js`'s `editWebsiteDomain(element, controlEditElement, { onSave, placeholderValue })` is a generic `contentEditable` inline editor (used for the company website field in `company-details.js`). Pass `placeholderValue` to have it clear the element's text as soon as editing starts if it currently equals that value — used so the "No website found" placeholder (`NO_WEBSITE_FOUND_TEXT` in `src/constants/config.js`) doesn't need to be manually deleted before typing a real domain. Cancelling (Escape/Tab, clicking away with no change, or saving empty) restores the original value, which is captured before the clear happens. On save, `handleDomainSave()` in `company-details.js` runs the value through `getHostName()` (from `company-data.js`) before validating with `isValidDomain()`, so a pasted full URL (e.g. `https://www.example.com/about?ref=123`) is converted to its bare domain (`example.com`) when possible, and the displayed `<span>` text is rewritten to that converted value.

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
