# Changelog

All notable changes to this project will be documented in this file.
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
