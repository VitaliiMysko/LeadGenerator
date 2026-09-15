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

Markdown documentation governance (which file owns what, and what must stay out of `CLAUDE.md`) is defined in [.claude/rules/documentation-governance.md](.claude/rules/documentation-governance.md) — follow it whenever adding or editing any `.md` file. Do not use `CLAUDE.md` as a repository of application documentation or implementation knowledge.

## Architecture

The extension has two execution environments — content scripts (`src/content-scripts/`) injected into LinkedIn pages, and the popup UI (`src/scripts/`, `index.html`). See [docs/architecture.md](docs/architecture.md) for component structure, data flow, and design rationale. Constraints to follow when writing code here:

- Content scripts must **not** make external network requests (CORS restriction). All `fetch` calls to external services belong in the popup, made **directly** — never routed through `background.js`.
- `src/scripts/workers/background.js` is used **only** for Chrome APIs requiring background context (`tabs`, `scripting`). Never add HTTP requests there — the MV3 service worker can be terminated mid-request, causing `null` responses via `sendMessage`.
- In `src/scripts/` (the popup), never call `String.prototype.trim()` or a regex-based `.replace()` on values that may contain non-ASCII letters — use `trimAsciiWhitespace()` from `src/utils/text-utils.js` instead. `libs/transliteration/bundle.umd.min.js` is loaded as a classic `<script>` and patches those built-ins globally for the whole popup page, silently corrupting some Latin Extended-A letters. This does not apply to content scripts, which run in a separate JS realm that never loads that bundle.
- New content scripts go in `src/content-scripts/`; only `common/constants.js` is statically registered in `manifest.json`. Everything else is injected on demand via `chrome.scripting.executeScript`, so a new page host only needs a `host_permissions` entry, not a `content_scripts` entry.
- New filters go in `src/scripts/containers/filters/`, reading/writing through `filter-store.js` (filters combine with AND logic). New button/action logic goes in `src/scripts/containers/data/`.
- Any new pure function (no DOM, no `chrome.*`, no `fetch`) belongs in `src/utils/` per the testing rule above.
