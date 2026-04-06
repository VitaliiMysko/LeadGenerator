# Lead Generator Extension

This extension is a straightforward tool for extracting data about individuals directly from a LinkedIn Sales Navigator page.

## Key Features

- **Modern, User-Friendly Interface**: The application features a simple, modern layout with intuitive functionality

- **Dynamic Tab Navigation**: The right panel uses a dropdown-based tab selector to keep the UI clean and scalable
  - Available tabs:
    - **Actual Experience** – displays extracted company experience data
    - **Settings** – allows customization of extension behavior

- **Data Extraction**:
  - **"Get" Button**: Automatically populates:
    - Name
    - Surname
    - Job Position
    - Link
    - Company Name
    - Country
    - Industry

    The "Email" field is not auto-filled.

  - **"Copy" Button**: Copies data to clipboard in spreadsheet-friendly format

## UI Structure

**Left Panel (Fixed):**

- Always visible
- Contains:
  - Core data fields
  - Main actions (**Get / Copy**)
- Fully editable inputs
- Supports drag & drop (configurable via Settings)
- Supports individual's names transliteration (configurable via Settings)

**Right Panel (Dynamic):**

- Controlled via dropdown tab selector
- Content updates dynamically without reloading the UI

**Tabs:**

1. **Actual Experience:** (default)
   - Displays a list of companies associated with the profile
   - Includes:
     - Job position
     - Website
     - Location
     - Industry
     - Company size
   - Selecting an entry updates:
     - Job Position
     - Company Name
     - Country
     - Industry (left panel)

2. **Settings:**
   - Provides control over extension behavior
   - Available option:
     - **Drag & Drop Toggle**
       - Enable / disable reordering of fields in the left panel
       - State is persisted via Chrome `storage`
     - **Transliteration Toggle**
       - Enable / disable individual's names transliteration
       - State is persisted via Chrome `storage`

## Data Fields

**Left Panel:**

- **Name**: The individual's first name
- **Surname**: The individual's last name
- **Job Position**: The individual’s current job position
- **Link**: The URL to the individual's LinkedIn profile
- **Email**: The individual’s working email address
- **Company Name**: The name of the company where the individual currently works
- **Country**: Country of the current company location
- **Industry**: Industry of the current company

Each field is editable to allow manual adjustments before saving.

## Additional Functionalities

- **Drag & Drop Field Reordering**:
  - Reorder fields in the left panel
  - Controlled via Settings
  - State is persisted using Chrome `storage`

- **Translation Service**: A translation icon next to the "Job Position" field enables translation of job titles into English. This feature uses the Google Cloud Translation API and requires the user to be signed in through their Google account to activate

- **Transliteration**: Transliterates the "Name" and "Surname" fields into Latin characters, ensuring proper representation of non-Latin scripts in saved data. This functionality is configurable and controlled via Settings

- **Email Service**: When clicking on a person's company website, the extension generates a basic email address and copies it to the clipboard. An email icon next to the "Email" field enables to run generation and find the validated email using a secure backend powered by the [Emailable API](https://emailable.com/). The valid email address is inserted into the "Email" field. A tick icon enables users to validate entered email on demand

## Network & Data Fetching Strategy

Due to modern browser security restrictions, the extension operates under the following model:

- Runs only on:
  - `https://www.linkedin.com/*`

**Important**

- The extension does NOT directly fetch external websites from the browser context
- All external requests are routed through a backend service

## Secure Architecture

All sensitive and cross-origin operations are handled via a [Cloudflare Worker](https://developers.cloudflare.com/workers/).

Includes:

- Email validation (via Emailable API)
- Website availability checks

Benefits:

- No API keys exposed
- No CORS issues
- Stable networking layer

## Performance & Reliability Improvements

- External requests are handled via backend proxy
- Prevents failures under heavy load
- Ensures consistent results across different environments

## Changelog

For a detailed list of changes, see [CHANGELOG.md](./CHANGELOG.md) file.

## Installation

### Option 1: Install from the Chrome Web Store

1. Go to the [Lead Generator extension page on the Chrome Web Store](Chrome_Web_Store_URL)
2. Click **Add to Chrome**
3. Confirm any permissions requested by the extension to complete the installation

After installation, you can pin the extension to your toolbar for quick access by clicking the puzzle icon in the Chrome toolbar and selecting **Pin** next to **Lead Generator**.

### Option 2: Install Locally from Source

1. **Download the Extension:**
   - Clone or download this repository as a `.zip` file to your local machine

2. **Prepare for Installation:**
   - Unzip the downloaded `.zip` file if necessary

3. **Load the Extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle switch in the upper right corner)
   - Click **Load unpacked** and select the folder where the extension files are located

4. **Pin the Extension (Optional):**
   - To pin the extension, click on the puzzle icon in the Chrome toolbar, find **Lead Generator**, and click the pin icon

5. **Permissions and Authorization:**
   - The extension will prompt for certain permissions to function correctly on LinkedIn Sales Navigator pages
   - Log in with your Google account if prompted to access the Google Translate feature

6. **Start Using the Extension:**
   - Navigate to a LinkedIn Sales Navigator profile page to begin using the **Get** and **Copy** buttons to collect data
   - The extension runs only through `https://www.linkedin.com/sales/lead/*` page, others pages such as `https://www.linkedin.com/sales/company/*`, `https://www.linkedin.com/company/*` use in the background mode

> **Note:** This extension is optimized for LinkedIn Sales Navigator pages. Some permissions may need to be granted to ensure full functionality

## Configuration

After installing the **Lead Generator** extension, follow these steps to configure it for optimal functionality:

1. **Permissions Configuration:**
   - Ensure the extension has permission to access `https://www.linkedin.com/sales/lead/*`, `https://www.linkedin.com/sales/company/*`, `https://www.linkedin.com/company/*` or other LinkedIn pages (depending on future expansion)
   - To adjust permissions manually, navigate to `chrome://extensions/`, find **Lead Generator**, and select **Details** to review and update permissions as needed

2. **Google Authentication (Optional):**
   - To use the translation feature within the extension, sign in with your Google account
   - This enables the **Google Translate API** to translate job titles from other languages into English
   - You will be prompted to sign in the first time you attempt to use the translation feature

3. **Field Reordering:**
   - Customize the order of the fields in the left panel using the drag-and-drop feature
   - This allows you to set the order of data as it will appear when saved to the clipboard, optimizing it for export to spreadsheet software

4. **LinkedIn Page Access:**
   - For the extension to operate correctly, navigate to a LinkedIn Sales Navigator profile page
   - Click on the **Get** button to populate fields with the available information from the page

5. **Data Collection and Clipboard Usage:**
   - All data collected remains in your local clipboard until you manually paste it into a document, spreadsheet, or other location. The extension does not store data persistently or transmit it to external servers

6. **Optional Fields and Manual Entry:**
   - If you need to add an email address, this can be done manually by typing into the "Email" field

7. **Email Validation Behavior:**
   - Validation is performed during the automatic generation of email addresses (by clicking the email icon). Each generated candidate is validated via the Emailable service using a secure backend, and the valid email is inserted into the "Email" field
   - Manually entered email address is validated by clicking the tick icon, and the extension does notify you of its validity

8. **Settings Tab:** You can configure behavior directly in the extension UI:

- Enable / disable drag & drop functionality
- Enable / disable individual's names transliteration
- Preferences are saved locally using Chrome `storage`

## Usage

1. **Navigating to LinkedIn Sales Navigator:**
   - Open a profile page on LinkedIn Sales Navigator where you wish to gather information

2. **Extracting Data:**
   - Click the **Get** button to automatically fill in fields with information from the LinkedIn Sales Navigator page (`https://www.linkedin.com/sales/lead/*`, `https://www.linkedin.com/sales/company/*`) and the LinkedIn page (`https://www.linkedin.com/company/*`) on demand, including the individual's name, surname, job position, profile link, any manually added email address, company name, country of company location and company industry

3. **Editing Fields:**
   - All fields are editable. You can modify the values in any field to ensure accuracy before saving

4. **Saving Data to Clipboard:**
   - Click the **Copy** button to save all field values to your clipboard. Data is formatted for easy pasting into spreadsheet software

5. **Reordering Fields (Optional):**
   - You can rearrange the input fields by dragging them up or down in the left panel. The order you set determines how data is organized when saved to the clipboard. This feature can be enabled or disabled via Settings

6. **Using Translation (Optional):**
   - If the job position is in a language other than English, click the translation icon next to the "Job Position" field. Sign in with your Google account if prompted to enable translation through Google Translate

7. **Transliteration (Optional):**
   - Transliterates the "Name" and "Surname" fields into Latin characters. This feature can be enabled or disabled via Settings

8. **Generating and Validating Emails (Optional):**
   - Click the email icon next to the "Email" field to initiate automatic email generation
   - The extension will try a series of common email formats and validate each via a secure backend using the Emailable API
   - The valid email found will be populated into the "Email" field
   - The email can be validated separately by clicking the tick icon

## Permissions

The "Lead generator" extension requires certain permissions to function effectively and ensure smooth operation:

1. **activeTab**:
   - Allows the extension to interact with the current tab and extract information from the LinkedIn Sales Navigator pages that you are viewing

2. **scripting**:
   - Enables the extension to inject necessary scripts into the LinkedIn Sales Navigator page for data extraction

3. **identity**:
   - Used for Google authentication when accessing Google services, such as the Google Translate API for translating job titles. This permission is only utilized if you activate the translation feature

4. **tabs**:
   - Used to enhance the processing of company-related data and improve the extension's functionality

5. **storage**:
   - Used to store user preferences locally

6. **host_permissions**:
   - Specific to LinkedIn pages. The extension is restricted to pages with the URL pattern `https://www.linkedin.com/sales/lead/*` as main, and `https://www.linkedin.com/sales/company/*` and `https://www.linkedin.com/company/*` on demand for gathering full information about person for the user. The extension does not interact with other LinkedIn pages
   - `https://my-apikey-worker.vitalij-musko.workers.dev/*` — to securely perform on-demand services such as email validation or website availability checks via a backend proxy owned by the developer. No personal data is stored, and requests are triggered only by user actions

## Requirements

To use the "Lead generator" extension, please ensure the following requirements are met:

1. **Google Chrome Browser**:
   - This extension is designed to work with Google Chrome. Please ensure you are using the latest version of Chrome for optimal performance

2. **LinkedIn Sales Navigator Access**:
   - A LinkedIn account with access to LinkedIn Sales Navigator (`https://www.linkedin.com/sales/lead/*`, `https://www.linkedin.com/sales/company/*`) is required, as the extension is tailored specifically for extracting information from Sales Navigator pages

3. **LinkedIn Access**:

- A LinkedIn account with access to `https://www.linkedin.com/company/*` is required, as the extension is tailored specifically for extracting information from Linkedin pages

4. **Google Account (for Translation Feature)**:
   - If you plan to use the Google Translate feature for job titles, you must be signed into your Google account to enable this functionality

5. **Chrome Web Store Installation**:
   - For easy updates and improved security, it’s recommended to install the extension from the official Chrome Web Store once it’s published

These requirements ensure that the extension functions as intended and that you have access to all features available within the "Lead generator" tool.

## Privacy Policy

This extension:

- Does **not** store personal data
- Does **not** track users
- Stores only **UI preferences locally** (via storage)
- Sends data externally only when required (e.g., email validation)

For full details, see [Privacy Policy](PRIVACY_POLICY.md).
