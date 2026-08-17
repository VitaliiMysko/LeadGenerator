# Changelog

All notable changes to this project will be documented in this file.

## [3.3.9] - 2026-08-14

### Added

- **Configurable saved leads limit**: new "Max saved leads" numeric field in the Settings tab's "Leads data" block, replacing the previous hardcoded 99-item cap. Accepts digits only, up to 9999. Saved automatically on blur when valid
- **Automatic trimming on limit decrease**: lowering the limit below the current number of saved leads prompts for confirmation; if confirmed, the oldest leads (first added) are removed to fit the new limit, otherwise the change is discarded
- **Persistent company data cache**: the last 10 companies whose details were successfully fetched from their LinkedIn page are now remembered in `chrome.storage.local`, keyed by company id. Reopening the popup (or revisiting a recently seen company) reuses the cached details instead of re-opening a background tab and re-scraping the company page. The refresh button (↻) still forces a live re-fetch and clears that company's cached entry
- **Company name fallback for the cache**: when the currently selected company has no LinkedIn link (and therefore no company id), the cache is now also searched by company name, so previously fetched details can still be reused
- **Cache stays in sync with manual website edits**: editing a company's website inline now updates that company's cached entry (matched by company id, or by name when no id is available) so the corrected website is reused on future lookups instead of the stale one
- **Pasted website URLs are converted to domain view**: saving the website field now converts a pasted full URL (e.g. `https://www.example.com/about?ref=123`) into its bare domain (`example.com`) whenever that's possible, instead of rejecting it as an invalid domain

### Fixed

- **Refresh button required two clicks to actually re-fetch**: clearing the cached entry before refreshing was fire-and-forget, so the very next cache lookup could race ahead and still read the stale entry, silently returning cached data instead of fetching. The cache clear is now awaited before refreshing, so the first click always triggers a live re-fetch
- **"No website found" placeholder no longer needs to be manually deleted**: clicking the edit icon when the website shows the "No website found" placeholder now clears it automatically, so the user can type the real domain straight away instead of deleting the placeholder text first

## [3.3.8] - 2026-07-10

### Added

- **Store company id setting**: new "Leads data" settings block with a "Store company id" toggle
- **Company id** field: derived from the active company's LinkedIn link and saved with each lead; appended as the last column when copying saved leads to the clipboard, if the setting is enabled

## [3.3.7] - 2026-06-10

### Added

- **Unit test suite**: Jest-based tests covering pure business logic
- **GitHub Actions CI pipeline** (`.github/workflows/test.yml`): unit tests run automatically on every push to `master` and on every pull request targeting `master`
- **Branch protection rule** on `master`: merging is blocked until the `test` CI check passes

### Changed

- **CSS refactoring**: split `main.css` (795 lines) into six focused stylesheets

### Fixed

- **Loading website animation**: dots now appear directly after the text without a gap
- **Background company data fetching**: support parallel usage across multiple browser windows

## [3.3.6] - 2026-06-10

### Added

- **Clean button confirmation**: clicking Clean now shows a custom in-page confirmation dialog (OK / Cancel) before clearing saved leads
- Translation is now routed through the Cloudflare Worker backend using a server-side Google API key; `chrome.identity` and OAuth2 are no longer required
- **Microsoft Edge support**
- **Firefox support**

### Changed

- **Clean button** is now disabled when there are no saved leads (counter equals 0)

## [3.3.5] - 2026-05-29

### Improved

- The quality and reliability of the application by the complex refactoring

## [3.3.4] - 2026-05-25

### Added

- **Get button counter** briefly scales up when the counter changes (Save or Clean), providing visual feedback that the count updated. The animation does not play on initial load
- **Members field** shows the associated members count next to company size, extracted from the LinkedIn company page
- **Country by default** setting: when enabled, a country picker appears in Settings; the selected country is used as a fallback when a company's location cannot be mapped to a known country

### Changed

- **LinkedIn button** now opens the official LinkedIn company page instead of the Sales Navigator company page, in a background tab so the user stays on the current page
- **Company data** is now fetched exclusively from the official LinkedIn company page; the `sales/company/*` host permission has been removed
- **Website Icon** is disabled by default and becomes clickable only when a valid website is confirmed
- **Loading text** is now displayed in a lighter color across all loading states

### Fixed

- **Save button** is now enabled automatically after lead data is populated via extraction or company-details fetch, without requiring a manual field edit to trigger it
- **Generate Emails button** is now enabled after the user manually edits the website domain, including when the original value was "No website found"
- **Website Icon** link updates correctly after a manual domain edit
- **Website validation** runs automatically after saving a domain edit; invalid-pattern domains show a warning and a red circle without a backend call

## [3.3.3] - 2026-05-15

### Added

- **Refresh button** (↻) in the company header of the Actual Experience tab re-fetches website, location, industry, and size from scratch
- **LinkedIn button** next to the Company name field opens the selected company's LinkedIn page in a new browser tab; the button is disabled (and shown in gray) when the selected company has no LinkedIn link
- **Development mode indicator**: extension toolbar icon is rendered in greyscale in the local environment, making it easy to distinguish a local development build from production at a glance
- **Remember field order** setting: when enabled, the left-panel field order is saved to storage after each drag-and-drop reorder and automatically restored the next time the extension is opened

### Changed

- **Save button** no longer requires the Email field to be filled; any lead with at least one non-empty field can be saved. When email is present it must be unique; when email is empty, all other fields must differ from every already-saved entry
- Replaced radio buttons in the Actual Experience tab with a clickable accordion
- Redesigned the company details section
- Left-panel data fields now use the same label style as the Actual Experience company details: small uppercase label above each input

### Improved

- The application was redesigned to avoid hard-coded values
- **Generate Emails** button is now disabled by default, when no company is active or available (filtered out), and when the active company has no website; enabled only when a valid website is detected
- **Validate Email** button is now disabled by default; enabled reactively as soon as the email field contains a valid email address
- **Get** button now copies leads in the current left-panel field order; if the user has reordered fields via drag-and-drop, the clipboard output reflects that order

### Fixed

- Drag-and-drop reordering now works when dropping anywhere on a field block (label, input, buttons), not just on the narrow gaps between child elements

## [3.3.2] - 2026-05-06

### Added

- **Save button** — saves current left-panel lead data to local storage; prevents duplicate entries by email
- **Get button** — copies all saved leads to the clipboard in tab-separated format (spreadsheet-friendly); shows live item count in label
- **Clean button** — removes all saved leads from local storage and resets the counter
- "No results" message in the Actual Experience tab when no data was extracted or all companies are hidden by active filters
- Left panel fields (job position, company name, country, industry, email) are cleared when "No results" is shown and restored from the first visible company when results return

### Fixed

- First visible company is now automatically selected when the previously checked radio is hidden by an active filter
- Background company detail fetch is now skipped for companies hidden by active filters at extraction time

### Changed

- Renamed "Get" button to "Extract" across UI, source files, and documentation
- Extract and Save buttons are now displayed side by side in a single row
- Get and Clean buttons are displayed side by side in a second row below the divider

### Removed

- **Copy button** is removed

## [3.3.1] - 2026-04-28

### Added

- New **Filters tab** in the right panel
- Multi-select filtering system based on:
  - Company headquarters location
  - Company size
- Tag-based selection UI:
  - Selected values are displayed as removable tags
  - Ability to remove selections individually
- Search functionality within dropdown for faster option discovery
- Extended list of supported locations:
  - Full list of European countries added for filtering
- Persistent filter state using Chrome Storage

### Changed

- Improved interaction between UI and state via subscribe/notify pattern

### Improved

- Better scalability for adding new filter types in the future
- Refactored background communication layer:
  - Added timeout handling and improved message reliability
  - Better handling of concurrent requests

## [3.3.0] - 2026-04-09

### Added

- Tab-based UI system in the right panel to improve navigation and scalability
- Dropdown tab selector for switching between functional views without layout reflows
- "Actual Experience" tab (default) with existing experience-related functionality
- "Settings" tab for managing extension behavior
- Persistent user preferences using Chrome Storage API
- Ability to enable or disable drag-and-drop field reordering via Settings
- Ability to enable or disable transliteration of personal names via Settings
- Support for non-Latin characters (e.g., Cyrillic) in name and surname fields
- "Company size" field of the selected company in the actual experience tab

### Changed

- Updated personal data handling logic:
  - Name and surname fields now preserve original values (including non-Latin characters)
  - Transliteration is re-applied dynamically after manual edits of name and surname fields, based on user settings
- Refactored right panel into a dynamic, SPA-like interface using a show/hide tab model
- Improved UI structure by separating:
  - Static left panel (core data and actions)
  - Dynamic right panel (tabs and controls)
- Updated internal logic to support state-driven UI behavior
- Restricted extension execution scope to:
  - `https://www.linkedin.com/*`

### Improved

- Improved overall usability and flexibility of the extension interface
- Enhanced scalability for future features (e.g., filters, additional tabs)
- Cleaner and more maintainable UI architecture
- Improved scrolling behavior in the right panel:
  - Scroll is now isolated to tab content only
  - Left panel remains fixed and always visible
  - Added custom, minimal scrollbar styled to match the UI

### Fixed

- Prevented layout shift caused by scrollbar appearance/disappearance in the tab content area

## [3.2.5] - 2025-11-11

### Added

- New email templates

### Optimized

- Increase timeout for loading web pages in the background

## [3.2.4] - 2025-10-15

### Added

- Ability to read the complete list of a person’s current positions
- Email validation feature triggered manually via button

### Optimized

- Mechanism for modifying and normalizing company domains

### Fixed

- Minor inaccuracies in person name transliteration
- Small stylistic and UI inconsistencies

## [3.2.3] - 2025-07-04

### Added

- The ability to manually enter an email before identifying the company's domain

### Optimized

- Obtaining additional data about the company
- Validation of the company's websites
- Removal of excess information from the company name, job position, and person's first and last name

## [3.2.2] - 2025-06-13

### Added

- Field "Country" showing the location of the selected company
- Field "Industry" showing the industry of the selected company
- Ability to fetch company details directly from the official LinkedIn company page
- Option to manually edit the company website if needed

### Optimized

- Templates for generating person's email addresses
- Logic for retrieving the person's full name

### Changed

- Refactored project structure for better modularity and maintainability

## [3.2.1] - 2025-05-14

### Added

- Developed an email generation mechanism based on company website, first name, and last name
- Integrated a third-party email validation service (Emailable API) to ensure deliverability of generated emails
- Provided real-time user feedback indicating the result of email generation and validation
- Implemented a secure backend (Cloudflare Worker) to protect and manage API keys used for validation

## [3.1.2] - 2025-04-02

### Added

- Implemented a mechanism for generating a basic email address and copying it to the clipboard when clicking on a person's company website

### Optimized

- Improved the retrieval process for additional person-related data

### Fixed

- Corrected the mechanism for obtaining direct LinkedIn profile link

## [3.1.1] - 2025-03-03

### Added

- Validation check for company website availability
- Copy functionality for the company website when clicked
- Navigation to the company website when clicking the website icon

### Fixed

- Corrected display issues for company website links
- Converted email addresses to lowercase when copied via the "Copy" button

### Changed

- Removed special characters and images from company names
- Optimized the display mechanism for a person's experience list
- Updated UI to reflect all new improvements

## [3.1.0] - 2025-02-04

### Added

- Display of company website in profile details
- Support for additional company name abbreviations (e.g., "SA")
- Improved translation accuracy for better contextual results

### Changed

- Refined person name parsing by removing new prefixes (e.g., "prof"), special characters, and embedded pictures
- Updated UI design for better readability and consistency

## [3.0.0] - 2024-12-06

### Added

- Alternative profile search via LinkedIn Sales Navigator
- Support for Irish surname prefixes (e.g., "Mc", "Mac", "O'")
- Version display in the extension interface

### Changed

- Refined company name parsing by removing trailing company type details
- Improved display of current experience on LinkedIn profiles

### Optimized

- Restructured and streamlined core application logic

## [2.1.0] - 2024-11-22

### Added

- Transliteration mechanism implemented for the "Name" and "Surname" fields
- Included a LICENSE file to ensure open-source compliance
- Included a CHANGELOG.md file for describing new features and possibilities

### Changed

- Removed the "Dr" prefix from person names
- Simplified company names by excluding type abbreviations
- Enhanced documentation with updates to the README.md file

## [2.0.0] - 2024-11-13

### Added

- Initial release of the extension with core features
