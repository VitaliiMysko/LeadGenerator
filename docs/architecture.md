# Architecture Overview – Lead Generator Extension

**Last updated**: May 14, 2025

This document provides a high-level overview of the architectural structure of the **Lead Generator** Chrome Extension. It is intended for developers and maintainers who wish to understand how the extension is structured and how its core components interact.

---

## 1. Overview

The extension is designed to extract structured data (name, surname, job position, LinkedIn profile link, etc.) from **LinkedIn Sales Navigator** pages. It operates entirely in the client environment, with optional secure interactions with external APIs for translation and email validation.

The extension is composed of modular JavaScript files, grouped logically into directories. These files operate in two main environments:

- **Content Scripts**: Run in the context of LinkedIn Sales Navigator pages.
- **Extension UI Scripts**: Power the popup interface, background logic, and user interactions.

---

## 2. Key Components

### 2.1 Content Scripts (`src/content-scripts`)

- Injected into `https://www.linkedin.com/sales/lead/*` pages.
- Responsible for extracting public data from the DOM of LinkedIn Sales Navigator via messaging.
- Examples: `lead.js`, `lead-experience.js`.

### 2.2 Extension Scripts (`src/scripts`)

Contain all logic related to the extension interface, state management, button behavior, drag-and-drop, and background communication.

#### ▸ `src/scripts/worker/`

- Contains `background.js`, used for tasks like validating email addresses through third-party APIs (e.g., Emailable).
- Runs as a background service worker.

#### ▸ `src/scripts/containers/data/`

Handles user-interaction logic related to core actions:

- `get-data.js` – Fetches and formats the data from the LinkedIn page when the "Get" button is clicked.
- `copy-data.js` – Copies the collected data to the clipboard.
- `drag-and-drop-data.js` – Handles reordering of elements in the popup via drag and drop.

### 2.3 Styles (`src/styles`)

- `main.css` defines styles for the popup interface and interactive components.

### 2.4 HTML Interface

- `index.html` is located at the root and serves as the popup's main container.

---

## 3. Technologies Used

- **Vanilla JavaScript** – No front-end frameworks are used.
- **Chrome Extension APIs** – Used for background workers, clipboard operations, and storage.
- **OAuth2 (Google)** – Used for authenticated access to Google Translate API during translations.

---

## 4. Third-Party Services

### 4.1 Emailable API

- Used for email verification.
- Accessed only via secure backend (Cloudflare Worker).
- No email address is validated on the client directly.

### 4.2 Google Cloud Translate API

- Optional.
- Used to translate non-English job titles into English.
- Requires Google account authentication via OAuth2.
- Translation is performed client-side during the session.

---

## 5. Security & Privacy Considerations

- **No user data is stored** — neither in localStorage, nor in a database.
- **No cookies are set or read**.
- **Clipboard is used only temporarily**, initiated manually by the user.
- **OAuth2 tokens** for Google Translate are handled by the Chrome Identity API and never stored.
- **All secret keys (Emailable API)** are stored only in the Cloudflare Worker.

For more, see [PRIVACY_POLICY.md](../PRIVACY_POLICY.md)

---

## 6. Data Flow Summary

1. User opens the popup.
2. On pressing "Get", content scripts extract data from the current LinkedIn Sales Navigator page.
3. Data is returned and displayed in the popup.
4. The user can:
   - Copy the data via the "Copy" button.
   - Rearrange data using drag-and-drop.
   - Translate job title via the Google Translate API (if logged in via Google OAuth2).
   - Trigger email generation:
     - Extension sends company domain to backend.
     - Backend validates generated emails via Emailable.
     - Valid result is returned and inserted into form and clipboard.
5. No data is stored on servers; data only exists temporarily in memory or clipboard.

---

## 7. Permissions Summary

```json
"permissions": [
  "activeTab",
  "scripting",
  "identity",
  "tabs"
],
"host_permissions": [
  "https://www.linkedin.com/sales/*"
]
```

---

## 8. Extensibility Notes

The modular directory structure allows easy scaling:

- New button logic can be added inside `containers/data/`.
- Background tasks can be isolated under `worker/`.
- Any new content scripts should go under `content-scripts/`.

---

## 9. Related Documents

- [`README.md`](../README.md) – Installation and usage instructions.
- [`PRIVACY_POLICY.md`](../PRIVACY_POLICY.md) – Explains what data is collected and how it is handled.
- [`CHANGELOG.md`](../CHANGELOG.md) – List of version changes.

---
