# Changelog

All notable changes to this project will be documented in this file.

## [3.3.0] - 2026-03-25

### Added

- Tab-based UI system in the right panel for improved navigation and scalability.
- Dropdown tab selector to switch between functional views without breaking layout constraints.
- New Actual experience tab (actual tab by default) with existing Actual experience functionality.
- New Settings tab for managing extension behavior.
- User preferences persistence using Chrome Storage API
- Ability to enable/disable Drag & Drop functionality via Settings.

### Changed

- Refactored right panel into a dynamic, SPA-like UI (show/hide tabs).
- Improved overall UI structure by separating:
    - Static left panel (core data & actions)
    - Dynamic right panel (tabs & controls)
- Updated internal logic to support state-driven UI behavior.

### Improved

- Enhanced usability and flexibility of the extension interface.
- Better scalability for adding future features (e.g., filters, logs).
- Cleaner and more maintainable UI architecture.


## [3.2.5] - 2025-11-11

### Added

- New email templates.

### Optimized

- Increase timeout for loading web pages in the background.

## [3.2.4] - 2025-10-15

### Added

- Ability to read the complete list of a person’s current positions.
- Email validation feature triggered manually via button.

### Optimized

- Mechanism for modifying and normalizing company domains.

### Fixed

- Minor inaccuracies in person name transliteration.
- Small stylistic and UI inconsistencies.

## [3.2.3] - 2025-07-04

### Added

- The ability to manually enter an email before identifying the company's domain.

### Optimized

- Obtaining additional data about the company.
- Validation of the company's websites.
- Removal of excess information from the company name, job position, and person's first and last name.

## [3.2.2] - 2025-06-13

### Added

- Field "Country" showing the location of the selected company.
- Field "Industry" showing the industry of the selected company.
- Ability to fetch company details directly from the official LinkedIn company page.
- Option to manually edit the company website if needed.

### Optimized

- Templates for generating person's email addresses.
- Logic for retrieving the person's full name.

### Changed

- Refactored project structure for better modularity and maintainability.

## [3.2.1] - 2025-05-14

### Added

- Developed an email generation mechanism based on company website, first name, and last name.
- Integrated a third-party email validation service (Emailable API) to ensure deliverability of generated emails.
- Provided real-time user feedback indicating the result of email generation and validation.
- Implemented a secure backend (Cloudflare Worker) to protect and manage API keys used for validation.

## [3.1.2] - 2025-04-02

### Added

- Implemented a mechanism for generating a basic email address and copying it to the clipboard when clicking on a person's company website.

### Optimized

- Improved the retrieval process for additional person-related data.

### Fixed

- Corrected the mechanism for obtaining direct LinkedIn profile link.

## [3.1.1] - 2025-03-03

### Added

- Validation check for company website availability.
- Copy functionality for the company website when clicked.
- Navigation to the company website when clicking the website icon.

### Fixed

- Corrected display issues for company website links.
- Converted email addresses to lowercase when copied via the "Copy" button.

### Changed

- Removed special characters and images from company names.
- Optimized the display mechanism for a person's experience list.
- Updated UI to reflect all new improvements.

## [3.1.0] - 2025-02-04

### Added

- Display of company website in profile details.
- Support for additional company name abbreviations (e.g., "SA").
- Improved translation accuracy for better contextual results.

### Changed

- Refined person name parsing by removing new prefixes (e.g., "prof"), special characters, and embedded pictures.
- Updated UI design for better readability and consistency.

## [3.0.0] - 2024-12-06

### Added

- Alternative profile search via LinkedIn Sales Navigator.
- Support for Irish surname prefixes (e.g., "Mc", "Mac", "O'").
- Version display in the extension interface.

### Changed

- Refined company name parsing by removing trailing company type details.
- Improved display of current experience on LinkedIn profiles.

### Optimized

- Restructured and streamlined core application logic.

## [2.1.0] - 2024-11-22

### Added

- Transliteration mechanism implemented for the "Name" and "Surname" fields.
- Included a LICENSE file to ensure open-source compliance.
- Included a CHANGELOG.md file for describing new features and possibilities

### Changed

- Removed the "Dr" prefix from person names.
- Simplified company names by excluding type abbreviations.
- Enhanced documentation with updates to the README.md file.

## [2.0.0] - 2024-11-13

### Added

- Initial release of the extension with core features.
