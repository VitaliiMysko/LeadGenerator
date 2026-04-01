# Privacy Policy for Lead Generator Extension

**Effective Date**: November 12, 2024  
**Last Updated**: March 31, 2026

Thank you for using the **Lead Generator** extension. This privacy policy explains how we collect, use, and protect information obtained through your use of this extension.

## 1. Data Collection

The "Lead Generator" extension allows users to collect publicly available information from LinkedIn profiles, specifically from:

- LinkedIn Sales Navigator pages (`https://www.linkedin.com/sales/lead/*`, `https://www.linkedin.com/sales/company/*`)
- LinkedIn company pages (`https://www.linkedin.com/company/*`)

The extension operates **only within LinkedIn domains** and does not run on other websites.

The data collected includes, but is not limited to:

- Name
- Surname
- Job position
- Company name
- LinkedIn profile link
- (Optional) Email address
- Country
- Industry

The **Email** field is not auto-filled by default. Email addresses may be:

- **Manually entered and validated** by the user (not stored); or
- **Automatically generated and validated** using common email patterns based on company websites

The **Country** and **Industry** fields refer to the selected company.

All information is collected **only when the user explicitly clicks the "Get" button**.  
The extension does **not passively collect or scrape data**.

## 2. Data Use

The collected data is used solely to:

- Display information within the extension UI
- Allow users to copy data to their clipboard

The extension does not:

- Store collected profile data locally or remotely
- Track user activity outside of LinkedIn
- Monitor clipboard content after copying

## 3. Local Storage Usage

The extension uses Chrome's `storage` permission to store **user preferences only**, such as:

- UI settings (e.g., enabling or disabling drag & drop functionality)

This data:

- Is stored locally on the user’s device
- Does not include any personally identifiable information
- Is not transmitted to external servers

## 4. Data Retention

The extension does not persistently store any collected or generated data.

- Data exists temporarily in the UI or clipboard
- Email validation and website checks are processed **in real-time**
- No data is retained after processing

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
- Data is stored only in the clipboard (temporarily)
- The extension does not access data after copying

You are responsible for how copied data is used or stored.

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
- **storage** — to store user preferences locally

## 10. Cookies

This extension does not set, store, or read cookies.

## 11. Changes to This Privacy Policy

This Privacy Policy may be updated periodically.

Any significant changes will be reflected:

- In updated versions of the extension
- In release notes or documentation

## 12. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us directly.