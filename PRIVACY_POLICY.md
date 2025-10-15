# Privacy Policy for Lead Generator Extension

**Effective Date**: November 12, 2024  
**Last Updated**: June 13, 2025

Thank you for using the **Lead Generator** extension. This privacy policy explains how we collect, use, and protect information obtained through your use of this extension.

## 1. Data Collection

The "Lead Generator" extension allows users to collect publicly available information from LinkedIn profiles, specifically from LinkedIn Sales Navigator pages. The data collected includes, but is not limited to:

- Name
- Surname
- Job position
- Company name
- LinkedIn profile link
- (Optional) Email address
- Country
- Industry

The **Email** field is not auto-filled by default. Email addresses may be:

- **Manually entered and validated** by the user (in which case they are not stored); or
- **Automatically generated and validated** using common email patterns based on company websites. In this case, validation is performed through a secure backend.

The **Country** and **Industry** fields refers to the selected company.

All information is collected only when the user explicitly clicks on the button **"Get"**. The extension does **not** passively collect or scrape data.

## 2. Data Use

Collected data is temporarily stored in your device’s clipboard for your convenience. The extension does not:

- Save any data locally or remotely
- Transmit collected personal data to any third-party service (except for temporary validation of generated email addresses via a secure backend)
- Track or monitor clipboard content after it is copied

All further handling and storage of the clipboard data is solely at the user's discretion.

## 3. Data Retention

The extension does not persistently store any collected or generated data. Email validation requests are processed **in real-time** via a secure backend (see section 5) and are not retained. Once copied to the clipboard, the data is no longer accessible by the extension.

## 4. No Third-Party Data Sharing

The extension does not share, sell, or transfer any user data to third parties. The only exception is for **temporary email validation**:

- When generating an email address or checking entered one on demand, the extension sends candidate email formats for validation to a secure backend
- The backend uses the **Emailable API** to verify whether the email is valid
- No personal data is retained, stored, or reused during this process

## 5. Secure Architecture

All sensitive operations (such as email validation and API key usage) are handled by a secure backend hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/). This architecture ensures:

- API keys and logic remain hidden from the client
- All communication between the extension and backend is encrypted
- No user-identifiable data is stored or reused after validation

## 6. User Control and Responsibility

You have full control over all data collected by the extension. Once copied to your clipboard, the extension no longer accesses or retains that data. You are responsible for how and where the data is stored, shared, or managed after copying.

## 7. Google Authentication

If you choose to use the translation feature for job titles, you will be prompted to sign in with your Google account via OAuth2. This is used solely for authenticated access to the **Google Translate API**. The extension:

- Does not store your Google credentials
- Does not access other parts of your Google account
- Uses the translation API only for the duration of your current session

## 8. Cookies

This extension does not set, store, or read cookies on your device.

## 9. Changes to This Privacy Policy

This Privacy Policy may be updated periodically. Any significant changes will be reflected in an updated version of the extension and communicated through the extension settings or release notes.

## 10. Contact Us

If you have any questions or concerns about this Privacy Policy or the use of your data, please contact us directly.
