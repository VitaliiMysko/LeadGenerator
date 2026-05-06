# Changelog

All notable changes to this project will be documented in this file.

## [3.3.5] - 2026-05-06

### Changed

- **Get button counter** — replaced plain text counter with a styled fraction: current count sits top-left, max sits bottom-right, separated by a 45° diagonal line; "Get" label is left-aligned with the counter pushed to the right edge

## [3.3.4] - 2026-05-06

### Changed

- **Button layout** — Extract and Save are now the only primary-row buttons; Get (progress bar, gray) and Clean (✕ icon, gray) are in the secondary row below the divider, styled to indicate lower priority
- **Get button** — progress bar fill now uses a gray scale (`#6c757d` → `#ced4da`) to de-emphasise it relative to primary actions; exact count shown as tooltip on hover
- **Clean button** — now an icon-only (✕) button with muted gray color
- **Storage limit** — maximum saved leads reduced from 100 to 99

### Removed

- **Copy button** — removed from UI along with all related code (`copy-data.js`, `copyBtnElement`)

## [3.3.3] - 2026-05-05

### Changed

- **Get button** — now copies all saved leads to the clipboard in tab-separated format (spreadsheet-friendly) instead of downloading a CSV file; paste directly into Excel or Google Sheets to populate rows

### Fixed

- **Save button** — now correctly enables after email is auto-filled by the email generation button

## [3.3.2] - 2026-05-04

### Added

- **Save button** — saves current left-panel lead data to local storage; disabled when email is empty or storage is full (100 items); prevents duplicate entries by email
- **Get button** — exports all saved leads as a CSV file; shows live item count in label (e.g. `Get (23/100)`)
- **Clean button** — removes all saved leads from local storage and resets the counter
- Horizontal divider separating Extract/Copy actions from the storage action group
- "No results" message in the Actual Experience tab when no data was extracted or all companies are hidden by active filters
- Left panel fields (job position, company name, country, industry, email) are cleared when "No results" is shown and restored from the first visible company when results return

### Fixed

- First visible company is now automatically selected when the previously checked radio is hidden by an active filter
- Background company detail fetch is now skipped for companies hidden by active filters at extraction time

### Changed

- Extract and Copy buttons are now displayed side by side in a single row
- Save, Get, and Clean buttons are displayed side by side in a second row below the divider
- Renamed "Get" button to "Extract" across UI, source files, and documentation

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
