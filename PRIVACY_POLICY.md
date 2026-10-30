# Privacy Policy for Lead Generator Extension

**Effective Date**: November 12, 2024  
**Last Updated**: October 31, 2026

Thank you for using the **Lead Generator** extension. This privacy policy explains how we collect, use, and protect information obtained through your use of this extension.

## 1. Data Collection

The "Lead Generator" extension allows users to collect publicly available information from LinkedIn profiles, specifically from:

- LinkedIn Sales Navigator lead pages (`https://www.linkedin.com/sales/lead/*`), including a lead opened from Sales Navigator people search (`https://www.linkedin.com/sales/search/people*`)
- Public LinkedIn profile pages (`https://www.linkedin.com/in/*`)
- LinkedIn company pages (`https://www.linkedin.com/company/*`), including a company's Jobs tab

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
- (Optional) Company id, when the "Store company id" setting is enabled
- (Optional) Whether the company has open jobs, when the "Store has open jobs" setting is enabled

To show the selected company's details (website, location, industry, size, number of members and, when "Store has open jobs" is enabled, the titles of its open job postings), the extension opens the company's LinkedIn page in a background tab, reads them, and closes the tab.

The **Email** field is not auto-filled by default. Email addresses may be:

- **Manually entered and validated** by the user (not stored); or
- **Automatically generated and validated** using common email patterns based on company websites

The **Country** and **Industry** fields refer to the selected company.

All information is collected **only on user action**: when the user clicks the "Extract" button, or when the user starts a search in the companion Leads Automate extension (see section 5.1), which runs the same action.  
The extension does **not passively collect or scrape data**.

## 2. Data Use

The collected data is used solely to:

- Display information within the extension UI
- Allow users to copy data to their clipboard
- Filter and refine displayed data within the extension UI based on user-selected criteria (e.g., location, size)
- Report the outcome of the actions run for the companion Leads Automate extension, on the user's device (see section 5.1)

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

## 3. Browser Storage Usage

The extension uses the browser's `storage` permission to store:

- User preferences and UI settings:
  - Drag-and-drop functionality
  - Left-panel field order (when "Remember field order" is enabled)
  - Individual's names transliteration
  - Default country fallback (when "Country by default" is enabled)
  - Maximum number of saved leads and the export format of copied leads
  - "Store company id" and "Store has open jobs" settings, and the job title keywords entered for the latter
- Selected filter values (e.g., company location, size)
- The position of the on-page launcher icon
- Details of the 10 most recently fetched companies (see section 3.2)
- User-saved lead data (only when explicitly saved by the user)

Preferences, settings and filter values are kept in the browser's synchronized extension storage: if the user has turned on sync in their browser, the browser syncs them across the user's own signed-in browsers. Saved leads, cached company details and the launcher position are kept only on the user's device and are never synced.

Filter settings:

- Are used only to customize the user experience
- Are applied locally to already extracted data
- Do not trigger additional data collection or external requests

## 3.1 Saved leads data

- Is stored locally on the user’s device using the browser's extension storage
- Is saved only after explicit user action: clicking the "Save" button, or a search the user starts in the companion Leads Automate extension (see section 5.1)
- Is never automatically transmitted to external servers
- Can be retrieved, exported to clipboard, or permanently removed by the user at any time

## 3.2 Cached company details

- The publicly available details of the 10 most recently fetched companies (company name and LinkedIn company id, website, location, industry, size, number of members, and the titles of their open job postings when "Store has open jobs" is enabled) are kept on the user's device, so they aren't fetched again for every lead
- They contain no information about the user or about individual leads
- The refresh button next to a company removes its cached details and fetches them again

## 4. Data Retention

The extension does not remotely persist collected or generated data.

Extracted data may be stored locally on the user’s device only when explicitly saved by the user using built-in storage features.

- Data may temporarily exist in:
  - The extension UI
  - Clipboard
  - Local browser storage (saved leads only after explicit user action; cached company details as described in section 3.2)
- Email validation and website checks are processed **in real-time**
- No data is retained after processing
- Filter settings may be stored as part of user preferences

## 5. No Third-Party Data Sharing

The extension does not sell, share, or distribute user data to third parties.

However, certain operations require **temporary processing via a secure backend**, including:

- Email validation
- Website availability checks
- Job title translation

In such cases:

- Only minimal required data (e.g., email, domain, or job title text) is sent
- Data is processed in real-time
- No data is stored, logged, or reused

## 5.1 Companion extension (Leads Automate)

Leads Automate is an optional companion extension by the same developer, which the user installs separately to work through Sales Navigator people search. When the user starts a search in it, it opens leads in the search results and asks Lead Generator to run **Extract**, email generation and **Save** for them, the same actions as the panel's buttons.

- Lead Generator answers only when its panel is open on that tab, and only the Leads Automate extension, identified by its extension id; no other extension or website can request these actions
- It returns to Leads Automate only the outcome of these actions: the person's name, surname and job position, the company name and website, the generated email, and whether the lead was saved
- This exchange takes place entirely inside the user's browser, between the two extensions on the user's device; nothing is sent to any server as part of it
- Leads saved this way are stored like any other saved lead (see section 3.1)

## 6. Secure Architecture

All sensitive and cross-origin operations are handled via a secure backend hosted on  
[Cloudflare Workers](https://developers.cloudflare.com/workers/).

This includes:

- Email validation (via **Emailable API**)
- Website availability checks
- Job title translation (via **Google Cloud Translation API**)

This architecture ensures:

- No API keys are exposed in the extension
- No CORS restrictions affect functionality
- All requests are securely proxied
- No user-identifiable data is stored or persisted
- No Google account or authentication is required from the user

## 7. User Control and Responsibility

You have full control over all data collected by the extension.

- Data is collected only on user action
- Data may be temporarily copied to the clipboard
- Data may optionally be stored locally on the user’s device using the browser's extension storage APIs
- The extension does not access data after copying

You are responsible for how copied data is used or stored.

Users may:

- Save lead data locally
- Retrieve previously saved leads
- Permanently remove saved leads at any time

## 8. Translation Service

The translation feature (job title translation) is performed via the secure Cloudflare Worker backend using a server-side Google Cloud Translation API key.

- No Google account or authentication is required from the user
- Only the job title text is sent to the backend for translation
- The text is translated in real-time and not stored or logged
- The API key is stored exclusively in the Cloudflare Worker and is never exposed to the client

## 9. Permissions Justification

The extension requests the following permissions:

- **scripting** — to extract data from the current LinkedIn page upon user action
- **tabs** — to manage background tab processing for company data
- **storage** — to store user preferences, filter settings, cached company details, and user-saved lead data

## 10. Cookies

This extension does not set, store, or read cookies.

## 11. Changes to This Privacy Policy

This Privacy Policy may be updated periodically.

Any significant changes will be reflected:

- In updated versions of the extension
- In release notes or documentation

## 12. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us directly.
