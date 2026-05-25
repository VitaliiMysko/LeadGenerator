# Privacy Policy for Lead Generator Extension

**Effective Date**: November 12, 2024  
**Last Updated**: May 25, 2026

Thank you for using the **Lead Generator** extension. This privacy policy explains how we collect, use, and protect information obtained through your use of this extension.

## 1. Data Collection

The "Lead Generator" extension allows users to collect publicly available information from LinkedIn profiles, specifically from:

- LinkedIn Sales Navigator pages (`https://www.linkedin.com/sales/lead/*`)
- LinkedIn company pages (`https://www.linkedin.com/company/*`)

The extension operates **only within LinkedIn domains** and does not run on other websites.

The data collected includes, but is not limited to:

- Name
- Surname
- Job position
- LinkedIn profile link
- (Optional) Email address
- Company name
- Country
- Industry

The **Email** field is not auto-filled by default. Email addresses may be:

- **Manually entered and validated** by the user (not stored); or
- **Automatically generated and validated** using common email patterns based on company websites

The **Country** and **Industry** fields refer to the selected company.

All information is collected **only when the user explicitly clicks the "Extract" button**.  
The extension does **not passively collect or scrape data**.

## 2. Data Use

The collected data is used solely to:

- Display information within the extension UI
- Allow users to copy data to their clipboard
- Filter and refine displayed data within the extension UI based on user-selected criteria (e.g., location, size)

The extension does not:

- Store collected profile data remotely
- Automatically persist extracted data without user action
- Track user activity outside of LinkedIn
- Monitor clipboard content after copying

## 2.1 Data Filtering

The extension provides filtering functionality to help users refine and organize extracted data.

- Filters (e.g., company location, size) are applied **only to data already extracted**
- Filtering is performed entirely **within the extension (client-side)**
- No additional data is collected, requested, or transmitted when filters are used

Filter selections are optional and exist solely to improve usability and data navigation.

## 3. Local Storage Usage

The extension uses Chrome's `storage` permission to store:

- User preferences and UI settings:
  - Drag-and-drop functionality
  - Left-panel field order (when "Remember field order" is enabled)
  - Individual's names transliteration
  - Default country fallback (when "Country by default" is enabled)
- Selected filter values (e.g., company location, size)
- User-saved lead data (only when explicitly saved by the user)

Filter settings:

- Are used only to customize the user experience
- Are applied locally to already extracted data
- Do not trigger additional data collection or external requests

## 3.1 Saved leads data

- Is stored locally on the user’s device using Chrome Storage
- Is saved only after explicit user interaction (e.g., clicking the "Save" button)
- Is never automatically transmitted to external servers
- Can be retrieved, exported to clipboard, or permanently removed by the user at any time

## 4. Data Retention

The extension does not remotely persist collected or generated data.

Extracted data may be temporarily stored locally on the user’s device only when explicitly saved by the user using built-in storage features.

- Data may temporarily exist in:
  - The extension UI
  - Clipboard
  - Local Chrome Storage (only after explicit user action)
- Email validation and website checks are processed **in real-time**
- No data is retained after processing
- Filter settings may be stored locally as part of user preferences

## 5. No Third-Party Data Sharing

The extension does not sell, share, or distribute user data.

However, certain operations require **temporary processing via a secure backend**, including:

- Email validation
- Website availability checks

In such cases:

- Only minimal required data (e.g., email or domain) is sent
- Data is processed in real-time
- No data is stored, logged, or reused

## 6. Secure Architecture

All sensitive and cross-origin operations are handled via a secure backend hosted on  
[Cloudflare Workers](https://developers.cloudflare.com/workers/).

This includes:

- Email validation (via **Emailable API**)
- Website availability checks

This architecture ensures:

- No API keys are exposed in the extension
- No CORS restrictions affect functionality
- All requests are securely proxied
- No user-identifiable data is stored or persisted

## 7. User Control and Responsibility

You have full control over all data collected by the extension.

- Data is collected only on user action
- Data may be temporarily copied to the clipboard
- Data may optionally be stored locally on the user’s device using Chrome's extension storage APIs.
- The extension does not access data after copying

You are responsible for how copied data is used or stored.

Users may:

- Save lead data locally
- Retrieve previously saved leads
- Permanently remove saved leads at any time

## 8. Google Authentication

If you use the translation feature, you will be prompted to sign in with your Google account via OAuth2.

This is used solely for:

- Accessing the **Google Translate API**

The extension:

- Does not store your Google credentials
- Does not access other Google account data
- Uses authentication only during active sessions

## 9. Permissions Justification

The extension requests the following permissions:

- **activeTab, scripting** — to extract data from the current LinkedIn page upon user action
- **tabs** — to manage background tab processing for company data
- **identity** — for Google OAuth authentication (translation feature)
- **storage** — to store user preferences, filter settings, and user-saved lead data locally on the device

## 10. Cookies

This extension does not set, store, or read cookies.

## 11. Changes to This Privacy Policy

This Privacy Policy may be updated periodically.

Any significant changes will be reflected:

- In updated versions of the extension
- In release notes or documentation

## 12. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us directly.
