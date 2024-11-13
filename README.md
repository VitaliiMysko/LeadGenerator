# Lead Generator Extension

This extension is a straightforward tool for extracting data about individuals directly from a LinkedIn Sales Navigator page.

## Key Features
- **Modern, User-Friendly Interface**: The application features a simple, modern layout with intuitive functionality.
- **Data Extraction**:
  - **"Get" Button**: Automatically populates the following fields with information extracted from the page: "Name," "Surname," "Job Position," "Link," and "Company Name."
  The Email field is not auto-filled by the extension; instead, it is manually entered by the user if desired. No automated collection of email addresses occurs.
  - **"Copy" Button**: Saves the values of the populated fields to the clipboard in a format compatible with spreadsheet applications.

## Data Fields

**Left Panel:**
- **Name**: The individual's first name.
- **Surname**: The individual's last name.
- **Job Position**: The individual’s current job position.
- **Link**: The URL to the individual's LinkedIn profile.
- **Email**: The individual’s email address.
- **Company Name**: The name of the company where the individual currently works.

Each field is editable to allow manual adjustments before saving.

**Right Panel:**
- Displays a list of companies and job positions associated with the individual’s profile. Selecting an entry updates the "Job Position" and "Company Name" fields on the left side with the selected information.

## Additional Functionalities

- **Drag & Drop Field Reordering**: You can rearrange the input fields on the left side to customize the order in which data is saved to the clipboard. This allows you to maintain the preferred data structure when copying information.

- **Translation Service**: A translation icon next to the "Job Position" field enables translation of job titles into English. This feature uses the Google Cloud Translation API and requires the user to be signed in through their Google account to activate.

## Installation

### Option 1: Install from the Chrome Web Store

1. Go to the [Lead Generator extension page on the Chrome Web Store](<Chrome_Web_Store_URL>).
2. Click **Add to Chrome**.
3. Confirm any permissions requested by the extension to complete the installation.

After installation, you can pin the extension to your toolbar for quick access by clicking the puzzle icon in the Chrome toolbar and selecting **Pin** next to **Lead Generator**.

---

### Option 2: Install Locally from Source

1. **Download the Extension:**
   - Clone or download this repository as a `.zip` file to your local machine.

2. **Prepare for Installation:**
   - Unzip the downloaded `.zip` file if necessary.

3. **Load the Extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle switch in the upper right corner).
   - Click **Load unpacked** and select the folder where the extension files are located.

4. **Pin the Extension (Optional):**
   - To pin the extension, click on the puzzle icon in the Chrome toolbar, find **Lead Generator**, and click the pin icon.

5. **Permissions and Authorization:**
   - The extension will prompt for certain permissions to function correctly on LinkedIn Sales Navigator pages.
   - Log in with your Google account if prompted to access the Google Translate feature.

6. **Start Using the Extension:**
   - Navigate to a LinkedIn Sales Navigator profile page to begin using the **Get** and **Copy** buttons to collect data.

---

> **Note:** This extension is optimized for LinkedIn Sales Navigator pages. Some permissions may need to be granted to ensure full functionality.

## Configuration

After installing the **Lead Generator** extension, follow these steps to configure it for optimal functionality:

1. **Permissions Configuration:**
   - Ensure the extension has permission to access `https://www.linkedin.com/sales/lead/` or other LinkedIn pages (depending on future expansion).
   - To adjust permissions manually, navigate to `chrome://extensions/`, find **Lead Generator**, and select **Details** to review and update permissions as needed.

2. **Google Authentication (Optional):**
   - To use the translation feature within the extension, sign in with your Google account.
   - This enables the **Google Translate API** to translate job titles from other languages into English.
   - You will be prompted to sign in the first time you attempt to use the translation feature.

3. **Field Reordering:**
   - Customize the order of the fields in the left panel using the drag-and-drop feature. 
   - This allows you to set the order of data as it will appear when saved to the clipboard, optimizing it for export to spreadsheet software.

4. **LinkedIn Page Access:**
   - For the extension to operate correctly, navigate to a LinkedIn Sales Navigator profile page.
   - Click on the **Get** button to populate fields with the available information from the page.

5. **Data Collection and Clipboard Usage:**
   - All data collected remains in your local clipboard until you manually paste it into a document, spreadsheet, or other location. The extension does not store data persistently or transmit it to external servers.

6. **Optional Fields and Manual Entry:**
   - If you need to add an email address, this can be done manually by typing into the "Email" field, as this information is not automatically extracted.

With these configurations, your extension will be ready for efficient and secure data collection from LinkedIn Sales Navigator pages.

## Usage

1. **Navigating to LinkedIn Sales Navigator:**
   - Open a profile page on LinkedIn Sales Navigator where you wish to gather information.

2. **Extracting Data:**
   - Click the **Get** button to automatically fill in fields with information from the LinkedIn page, including the individual's name, surname, job position, company name, profile link, and any manually added email address.

3. **Editing Fields:**
   - All fields are editable. You can modify the values in any field to ensure accuracy before saving.

4. **Saving Data to Clipboard:**
   - Click the **Copy** button to save all field values to your clipboard. Data is formatted for easy pasting into spreadsheet software.

5. **Reordering Fields (Optional):**
   - You can rearrange the input fields by dragging them up or down in the left panel. The order you set determines how data is organized when saved to the clipboard.

6. **Using Translation (Optional):**
   - If the job position is in a language other than English, click the translation icon next to the "Job Position" field. Sign in with your Google account if prompted to enable translation through Google Translate.

This guide will help you quickly get started and make the most of the extension's features for efficient data collection and management.

## Permissions

The "Lead generator" extension requires certain permissions to function effectively and ensure smooth operation:

1. **activeTab**:
   - Allows the extension to interact with the current tab and extract information from the LinkedIn Sales Navigator pages that you are viewing.

2. **scripting**:
   - Enables the extension to inject necessary scripts into the LinkedIn Sales Navigator page for data extraction.

3. **identity**:
   - Used for Google authentication when accessing Google services, such as the Google Translate API for translating job titles. This permission is only utilized if you activate the translation feature.

4. **host_permissions**:
   - Specific to LinkedIn pages. The extension is restricted to pages with the URL pattern `https://www.linkedin.com/sales/lead/*` and only operates on these pages, ensuring limited access.

The permissions are necessary for the extension to perform its data extraction and translation functions securely and effectively. The extension does not store or transmit user data beyond the local environment.

## Requirements

To use the "Lead generator" extension, please ensure the following requirements are met:

1. **Google Chrome Browser**:
   - This extension is designed to work with Google Chrome. Please ensure you are using the latest version of Chrome for optimal performance.

2. **LinkedIn Sales Navigator Access**:
   - A LinkedIn account with access to LinkedIn Sales Navigator is required, as the extension is tailored specifically for extracting information from Sales Navigator pages.

3. **Google Account (for Translation Feature)**:
   - If you plan to use the Google Translate feature for job titles, you must be signed into your Google account to enable this functionality.

4. **Chrome Web Store Installation**:
   - For easy updates and improved security, it’s recommended to install the extension from the official Chrome Web Store once it’s published.

These requirements ensure that the extension functions as intended and that you have access to all features available within the "Lead generator" tool.

## Privacy Policy

The "Lead generator" extension respects your privacy and is committed to protecting your personal information. For detailed information on how we collect, use, and protect your data, please refer to our [Privacy Policy](PRIVACY_POLICY.md).

By using this extension, you agree to the terms outlined in our Privacy Policy. If you have any questions or concerns, feel free to contact us.

## License

The "Lead generator" extension is open-source and available under the [MIT License](LICENSE). You are free to use, modify, and distribute this extension, provided that you comply with the terms of the MIT License.

For more information about the MIT License, please refer to the LICENSE file in the repository.
