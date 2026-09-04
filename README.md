# Lead Generator Extension

This extension is a straightforward tool for extracting data about individuals directly from LinkedIn Sales Navigator pages or public LinkedIn profile pages.

## Key Features

- **Modern, User-Friendly Interface**:

  The application features a simple, modern layout with intuitive functionality

- **Dynamic Tab Navigation**:

  The right panel uses a dropdown-based tab selector to keep the UI clean and scalable
  - Available tabs:
    - **Actual Experience** – displays extracted company experience data
    - **Filters** – allows filtering extracted company data
    - **Settings** – allows customization of extension behavior

- **Data Extraction**:
  - **"Extract" Button** (primary): Automatically populates all left-panel fields:
    - Name
    - Surname
    - Job Position
    - Link
    - Company Name
    - Country
    - Industry

    The "Email" field is not auto-filled.

- **Storage utility buttons**:
  - **"Save" Button** (primary): Saves the current left-panel lead to local storage. Disabled when all fields are empty or the configured limit is reached (99 by default, adjustable in Settings up to 9999). When email is present it must be unique; when email is empty, all other fields must differ from every already-saved entry..
  - **"Get" Button** (progress bar): Copies all saved leads to the clipboard in tab-separated format; paste directly into Excel or Google Sheets to populate rows. Column order matches the current left-panel field order. When **Store company id** is enabled in Settings, the company id is appended as an extra last column. Fill level shows storage usage relative to the configured limit; hover to see exact count.
  - **"Clean" Button**: Removes all saved leads from local storage and resets the counter. Disabled when there are no saved leads. Shows a confirmation dialog before clearing.

## UI Structure

### Left Panel (Fixed)

- Always visible
- Contains:
- Core data fields
- Main actions (**Extract / Save / Get / Clean**)
- Fully editable inputs
- Supports drag-and-drop (configurable via Settings)
- Supports names transliteration (configurable via Settings)

### Right Panel (Dynamic)

- Controlled via dropdown tab selector
- Content updates dynamically without reloading the UI

## Tabs

### 1. Actual Experience (default)

Displays a list of companies associated with the profile as an interactive accordion

- Each row always shows: company **name** and **job position**
- Clicking a row expands it and collapses any previously open entry; an arrow indicator reflects the expand state
- Shows **"No results"** if no data was extracted or all entries are hidden by active filters
- Expanded company details include:
  - Website (click to copy a basic email address; click the edit icon to correct it inline — if it currently shows "No website found", that placeholder is cleared automatically as soon as editing starts). Pasting a full URL (e.g. `https://www.example.com/about?ref=123`) and saving automatically converts it to its bare domain (`example.com`) when possible
  - Industry
  - Location
  - Company size
  - Members (associated LinkedIn members count)

- Active company header includes a **Refresh button (↻)** to re-fetch company data on demand
  - Only visible for the currently active company
  - Spins while loading; blocked during in-flight requests to prevent double-fetching
  - Clears that company's cached entry, forcing a live re-fetch from LinkedIn

- **Persistent company data cache**: the last 10 companies whose details were successfully fetched are remembered across popup sessions (keyed by company id), so revisiting a recently seen company reuses the cached data instead of opening a new background tab
  - When the selected company has no LinkedIn link (and so no company id), the cache is looked up by company name instead
  - Editing a company's website inline updates that company's cached entry so the corrected value is reused afterward

- Selecting a company updates the left panel:
  - Job position
  - Company name
  - Country
  - Industry

### 2. Filters

Provides advanced filtering for extracted company data

### Supported Filters

- **Company location**
- **Company size**

### Behavior

- Multi-select dropdown
- Selected values are displayed as **removable tags**
- Removing a tag restores the option back to the dropdown
- Filters can be combined

### Architecture

- Powered by a lightweight **state manager**
- Filter state is:
  - Stored locally via Chrome `storage`
  - Automatically restored on reload

### 3. Settings

Provides control over extension behavior

Available option:

- **Drag-and-drop Toggle**
  - Enable / disable reordering of fields in the left panel
  - State persisted via Chrome `storage`
- **Remember field order Toggle**
  - When enabled, saves the current field order to storage after each drag-and-drop reorder
  - Order is automatically restored the next time the extension is opened
  - State persisted via Chrome `storage`
- **Transliteration Toggle**
  - Enable / disable individual's names transliteration
  - State persisted via Chrome `storage`
- **Country by default Toggle**
  - When enabled, reveals a searchable country picker
  - The selected country is used as a fallback for the **Country** field when the company's location cannot be mapped to a known country
  - State and selected country persisted via Chrome `storage`

**Leads data** (separate settings block):

- **Store company id Toggle**
  - When enabled, the **Get** button appends the company id as an extra, last column when copying saved leads to the clipboard
  - State persisted via Chrome `storage`
- **Max saved leads**
  - Numeric field controlling how many leads can be stored locally (1-9999, default 99); only digits can be typed
  - Saved automatically when the field loses focus, if the value is valid
  - Lowering the limit below the current number of saved leads prompts for confirmation before removing the oldest saved leads (first added) to fit the new limit; declining the confirmation discards the change
  - State persisted via Chrome `storage`

## Data Fields

### Left Panel

- **Name** - individual's first name
- **Surname** - individual's last name
- **Job Position** - current role
- **Link** - LinkedIn profile URL
- **Email** - working email address
- **Company Name** — current company; includes a LinkedIn button (🔗) that opens the company's LinkedIn page in a new tab; disabled and shown in gray when no link is available
- **Country** - company location
- **Industry** - company indutry
- **Company id** - not shown as a visible field; derived from the numeric id in the company's LinkedIn link (e.g. `.../company/80894209` → `80894209`), empty string if it cannot be determined. Saved with the lead and included in the Get button's clipboard output only when **Store company id** is enabled in Settings

All fields are editable before copying.

## Additional Functionalities

### Drag-and-drop Field Reordering

- Reorder fields in the left panel
- Controlled via Settings
- Field order can be persisted and restored on next open via the **Remember field order** setting

### Translation Service

- Translate job titles into English
- Uses Google Cloud Translation API via the Cloudflare Worker backend
- No Google account authentication required

### Transliteration

- Supports both **Latin and non-Latin (e.g., Cyrillic) names**
- Converts names into Latin characters when enabled
- Works:
  - After data extraction
  - After manual editing of fields
- Fully configurable via Settings

### Email Service

- Generate and validate email addresses
- Uses common patterns based on company domain
- Validation powered by secure backend via [Emailable API](https://emailable.com/)

Includes:

- Auto-generation + validation — button is enabled only when the active company has a detected website; disabled otherwise
- Manual validation via icon — button is enabled only when the email field contains a valid email address; disabled otherwise

## Network & Data Fetching Strategy

Due to browser security restrictions:

- Runs only on:
  - `https://www.linkedin.com/*`

**Important**

- The extension does not directly communicate with third-party services from the client
- All external requests are routed through a backend service

## Secure Architecture

All sensitive operations are handled via a a [Cloudflare Worker](https://developers.cloudflare.com/workers/).

Includes:

- Email validation (via Emailable API)
- Website availability checks

Benefits:

- No API keys exposed
- No CORS issues
- Stable networking layer

## Performance & Reliability Improvements

- Backend proxy for external requests
- Improved stability under load
- Consistent behavior across environments

## Development & Testing

### Prerequisites

Install dev dependencies (Jest) once after cloning:

```
npm install
```

### Running tests

```
npm test
```

Jest runs all files under `tests/`. The suite covers pure business logic only — no DOM, no Chrome APIs, no network calls.

### CI/CD

A GitHub Actions workflow (`.github/workflows/test.yml`) runs the full test suite automatically on every push to `master` and on every pull request targeting `master`.

The `master` branch is protected: a PR cannot be merged until the `test` check passes. This is enforced via a classic branch protection rule in the repository settings.

### Adding new tests

Pure logic (no DOM, no Chrome API, no `fetch`) belongs in `src/utils/` and should have a corresponding file in `tests/`. Logic that is tightly coupled to DOM or Chrome APIs is not unit-tested — verify it manually in the browser.

Modules whose only browser dependency is `chrome.storage` (no DOM, no `chrome.tabs`/`scripting`/`runtime`) can also be tested by mocking the storage wrapper with `jest.unstable_mockModule` before dynamically importing the module under test.

## Changelog

For a detailed list of changes, see [CHANGELOG.md](./CHANGELOG.md) file.

## Browser Compatibility

| Browser | Support | Minimum version |
|---|---|---|
| Chrome | Full | any current |
| Microsoft Edge | Full | any current |
| Firefox | Full | 128.0 |
| Safari | Not supported | — |

## Installation

### Chrome / Edge

#### Option 1: Install from the Chrome Web Store

1. Go to the [Lead Generator extension page on the Chrome Web Store](https://chromewebstore.google.com/detail/negmangnhbhanhajjpcjgecieghmdldm)
2. Click **Add to Chrome**
3. Confirm permissions

#### Option 2: Install Locally from Source

1. Download or clone repository
2. Unzip if needed
3. Open `chrome://extensions/`
4. Enable **Developer mode**
5. Click **Load unpacked**

### Firefox

#### Option 1: Install Temporarily (for development)

1. Download or clone repository
2. Open `about:debugging` in Firefox
3. Click **This Firefox**
4. Click **Load Temporary Add-on…**
5. Select `manifest.json` from the repository root

> Temporary add-ons are removed when Firefox is closed.

#### Option 2: Install Permanently (signed package)

The extension must be signed via [Firefox Add-ons (AMO)](https://addons.mozilla.org/) or Mozilla's self-distribution signing service before it can be installed permanently.

> **Note:** This extension is optimized for LinkedIn Sales Navigator pages and public LinkedIn profile pages. Some permissions may need to be granted to ensure full functionality

## Configuration

After installing the extension, configure it for optimal usage:

1. **Permissions**
   - Ensure access to `https://www.linkedin.com/*`
   - Required for data extraction

2. **Translation**
   - No authentication required — handled server-side via the Cloudflare Worker

3. **Settings (via Settings Tab)**
   - Enable / disable drag-and-drop
   - Enable / disable transliteration
   - Enable / disable storing the company id in the Get button's clipboard output (**Leads data** block)
   - Set the maximum number of leads that can be stored locally, 1-9999 (**Leads data** block)
   - Preferences are stored locally via Chrome `storage`

4. **Filters**
   - Configure company filtering (location, size)
   - Preferences are stored locally via Chrome `storage`

5. **Email Features**
   - Email generation and validation is performed via secure backend
   - No data is stored

## Usage

1. Open a public LinkedIn profile page (`linkedin.com/in/...`), or any other `linkedin.com` page (e.g. a Sales Navigator lead page) — the latter is extracted best-effort using the Sales Navigator logic

2. Click **Extract**
   - Extracts available profile and company data
   - On a public profile page, if the visible Experience section may be hiding further current positions behind a "Show all" link, the full experience list is fetched automatically in the background before the fields are populated

3. Review and edit fields (optional)
   - All fields are fully editable

4. (Optional) Use Filters
   - Narrow down company data by location or size

5. (Optional) Use additional features:
   - Translate job title
   - Enable transliteration
   - Generate / validate email

6. Click **Save**
   - Saves current lead data locally

7. Click **Get**
   - Copies all saved leads in spreadsheet-ready format

8. (Optional) Click **Clean**
   - Removes all saved leads from local storage

## Permissions

The "Lead generator" extension requires certain permissions to function effectively and ensure smooth operation:

- **activeTab** - access current page
- **scripting** - inject scripts
- **tabs** - tab interaction
- **storage** - store user preferences, filter state, and user-saved lead data locally

### Host Permissions

- `https://www.linkedin.com/*` – extract data
- `https://lead-generator-backend-worker.vitalij-musko.workers.dev` – backend services

## Requirements

- Google Chrome
- LinkedIn Sales Navigator access, or a LinkedIn account able to view public profile pages

## Privacy Policy

This extension:

- Does **not** track users
- Does **not** sell or share personal data
- Stores user preferences and optionally user-saved lead data locally using Chrome Storage
- Saves lead data only after explicit user interaction
- Sends data externally only when required (e.g., email validation or website checks)

Users maintain full control over locally stored data and may retrieve or remove it at any time.

For full details, see [Privacy Policy](PRIVACY_POLICY.md).
