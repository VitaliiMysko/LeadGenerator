# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a **vanilla JavaScript browser extension (Manifest V3) for Chrome and Firefox** with no build system or transpiler. Changes must keep working in both.

**To load the extension locally:**
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the repo root

In Firefox: `about:debugging` → **This Firefox** → **Load Temporary Add-on…** → select `manifest.json`.

**To apply changes:** reload the extension (`chrome://extensions/` card, or **Reload** in `about:debugging`), then refresh the LinkedIn tab — content scripts are only injected on page load.

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

A push to `prod` triggers `.github/workflows/release-chrome-web-store.yml`, which builds, packages, and publishes the extension to the Chrome Web Store. Chrome Web Store credentials live only in the `production` GitHub Environment's secrets — never in this repo, never in the Cloudflare Worker, never in a log. See [docs/release.md](docs/release.md) for the full release process; do not duplicate that content here.

## Documentation

Every task must include updates to all relevant `.md` files: `CHANGELOG.md`, `README.md`, `docs/architecture.md`, and `CLAUDE.md` if the architecture or workflow changes. `CHANGELOG.md` follows the existing versioning format.

Markdown documentation governance (which file owns what, and what must stay out of `CLAUDE.md`) is defined in [.claude/rules/documentation-governance.md](.claude/rules/documentation-governance.md) — follow it whenever adding or editing any `.md` file. Do not use `CLAUDE.md` as a repository of application documentation or implementation knowledge.

Chrome Web Store listing content (`docs/chrome-web-store/`) is governed separately by [.claude/rules/chrome-web-store.md](.claude/rules/chrome-web-store.md) — check it whenever a change affects permissions, host access, or user-facing functionality. Validate it with `npm run validate:chrome-store`.

## Architecture

The extension has two execution environments — content scripts (`src/content-scripts/`) injected into LinkedIn pages, and the panel UI (`src/scripts/`, `index.html`), an extension page loaded in an iframe over the LinkedIn page. See [docs/architecture.md](docs/architecture.md) for component structure, data flow, and design rationale. Constraints to follow when writing code here:

- Content scripts must **not** make external network requests (CORS restriction). All `fetch` calls to external services belong in the panel, made through `src/scripts/services/worker-client.js` — never with a direct `fetch`, and never routed through `background.js` in Chrome.
- `src/scripts/workers/background.js` is used **only** for Chrome APIs requiring background context (`tabs`, `scripting`). Never add HTTP requests there — the MV3 service worker can be terminated mid-request, causing `null` responses via `sendMessage`. **Sole exception:** its `workerFetch` handler, which serves Firefox only (where the panel's own requests are aborted and the background is an event page, not a service worker) and accepts only the Worker's origin.
- In the panel (`src/scripts/`), never call `chrome.tabs.*` or `chrome.scripting.*` directly — go through `src/scripts/services/tab-bridge.js`, adding a relayed action there and in `background.js` if needed. Firefox doesn't expose those APIs to the panel's framed extension page (see `docs/architecture.md` §2.2).
- In `src/scripts/` (the panel), never call `String.prototype.trim()` or a regex-based `.replace()` on values that may contain non-ASCII letters — use `trimAsciiWhitespace()` from `src/utils/text-utils.js` instead. `libs/transliteration/bundle.umd.min.js` is loaded as a classic `<script>` and patches those built-ins globally for the whole panel page, silently corrupting some Latin Extended-A letters. This does not apply to content scripts, which run in a separate JS realm that never loads that bundle.
- New content scripts go in `src/content-scripts/`; only `common/constants.js` and `panel/floating-panel.js` (the launcher/panel host) are statically registered in `manifest.json`. Everything else is injected on demand via `chrome.scripting.executeScript`, so a new page host only needs a `host_permissions` entry, not a `content_scripts` entry.
- New filters go in `src/scripts/containers/filters/`, reading/writing through `filter-store.js` (filters combine with AND logic). New button/action logic goes in `src/scripts/containers/data/`.
- Any new pure function (no DOM, no `chrome.*`, no `fetch`) belongs in `src/utils/` per the testing rule above.
