# Lead Generator Extension

This extension is a straightforward tool for extracting data about individuals directly from LinkedIn Sales Navigator pages.

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
  - **"Save" Button** (primary): Saves the current left-panel lead to local storage. Disabled when all fields are empty or the 99-item limit is reached. When email is present it must be unique; when email is empty, all other fields must differ from every already-saved entry..
  - **"Get" Button** (progress bar): Copies all saved leads to the clipboard in tab-separated format; paste directly into Excel or Google Sheets to populate rows. Column order matches the current left-panel field order. Fill level shows storage usage (0 = empty, full = 99 items); hover to see exact count.
  - **"Clean" Button**: Removes all saved leads from local storage and resets the counter.

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
  - Website (click to copy a basic email address)
  - Industry
  - Location
  - Company size

- Active company header includes a **Refresh button (↻)** to re-fetch company data on demand
  - Only visible for the currently active company
  - Spins while loading; blocked during in-flight requests to prevent double-fetching

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

All fields are editable before copying.

## Additional Functionalities

### Drag-and-drop Field Reordering

- Reorder fields in the left panel
- Controlled via Settings
- Field order can be persisted and restored on next open via the **Remember field order** setting

### Translation Service

- Translate job titles into English
- Uses Google Cloud Translation API
- Requires Google account authentication

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

## Changelog

For a detailed list of changes, see [CHANGELOG.md](./CHANGELOG.md) file.

## Installation

### Option 1: Install from the Chrome Web Store

1. Go to the [Lead Generator extension page on the Chrome Web Store](Chrome_Web_Store_URL)
2. Click **Add to Chrome**
3. Confirm permissions

### Option 2: Install Locally from Source

1. Download or clone repository
2. Unzip if needed
3. Open `chrome://extensions/`
4. Enable **Developer mode**
5. Click **Load unpacked**

> **Note:** This extension is optimized for LinkedIn Sales Navigator pages. Some permissions may need to be granted to ensure full functionality

## Configuration

After installing the extension, configure it for optimal usage:

1. **Permissions**
   - Ensure access to `https://www.linkedin.com/*`
   - Required for data extraction

2. **Google Authentication (Optional)**
   - Required for translation feature
   - Triggered on first use

3. **Settings (via Settings Tab)**
   - Enable / disable drag-and-drop
   - Enable / disable transliteration
   - Preferences are stored locally via Chrome `storage`

4. **Filters**
   - Configure company filtering (location, size)
   - Preferences are stored locally via Chrome `storage`

5. **Email Features**
   - Email generation and validation is performed via secure backend
   - No data is stored

## Usage

1. Open a LinkedIn Sales Navigator profile page

2. Click **Extract**
   - Extracts available profile and company data

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
- **identity** - Google authentication
- **tabs** - tab interaction
- **storage** - store user preferences, filter state, and user-saved lead data locally

### Host Permissions

- `https://www.linkedin.com/*` – extract data
- `https://lead-generator-backend-worker.vitalij-musko.workers.dev` – backend services

## Requirements

- Google Chrome
- LinkedIn Sales Navigator access
- (Optional) Google account for translation

## Privacy Policy

This extension:

- Does **not** track users
- Does **not** sell or share personal data
- Stores user preferences and optionally user-saved lead data locally using Chrome Storage
- Saves lead data only after explicit user interaction
- Sends data externally only when required (e.g., email validation or website checks)

Users maintain full control over locally stored data and may retrieve or remove it at any time.

For full details, see [Privacy Policy](PRIVACY_POLICY.md).
