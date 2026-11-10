// User-facing release notes shown in the panel's "What's new" dialog,
// newest first. One short line per change; the full history is in
// CHANGELOG.md. A release needs an entry here for its version (checked by
// tests/release-notes.test.js), or the "What's new" marker has nothing to show.
// Item types: "added", "changed", "fixed", "removed".
export const RELEASE_NOTES = [
  {
    version: "3.7.1",
    date: "2026-11-09",
    items: [
      { type: "fixed", text: "Leads Automate installed from the Chrome Web Store can run Extract, Generate and Save and open the panel" },
    ],
  },
  {
    version: "3.7.0",
    date: "2026-11-09",
    items: [
      { type: "added", text: "Copy column names setting: choose whether tab-separated Get starts with a row of column names" },
      { type: "added", text: "Leads Automate can run Extract, Generate and Save and open the panel in Firefox too" },
    ],
  },
  {
    version: "3.6.1",
    date: "2026-11-05",
    items: [
      { type: "changed", text: "New logo on the page icon, in the extensions list and in the store" },
      { type: "changed", text: "Clearer tab selector: the content behind the open list is blurred and the current tab is highlighted" },
      { type: "changed", text: "Tab-separated Get starts with a row of column names" },
      { type: "fixed", text: "Link always holds the public LinkedIn profile, never a Sales Navigator page" },
    ],
  },
  {
    version: "3.6.0",
    date: "2026-11-03",
    items: [
      { type: "added", text: "Leads Automate can run Extract, Generate and Save for the person it opened in people search" },
      { type: "changed", text: "Website status shown as a badge on the website icon: a green check or a red exclamation mark" },
      { type: "fixed", text: "Company details load for every position at the same company" },
    ],
  },
  {
    version: "3.5.0",
    date: "2026-10-21",
    items: [
      { type: "added", text: "Store has open jobs setting, optionally narrowed to job title keywords" },
      { type: "changed", text: "Selecting another person in people search clears the panel" },
      { type: "changed", text: "Extract in people search starts on the company the person was found under" },
      { type: "fixed", text: "Company details no longer mix up people in people search" },
      { type: "fixed", text: "Companies without open jobs are no longer checked again for every lead" },
    ],
  },
  {
    version: "3.4.1",
    date: "2026-10-05",
    items: [
      { type: "changed", text: "The Country field only accepts a country from the list" },
      { type: "removed", text: "Company names in Actual experience no longer open LinkedIn: use the LinkedIn button by Company name" },
      { type: "fixed", text: "A generated email is reused only for the same person, not anyone at the same company" },
      { type: "fixed", text: "Company details, company size and current positions are read in every LinkedIn language" },
      { type: "fixed", text: "Sales Navigator lead pages work in every interface language" },
    ],
  },
  {
    version: "3.4.0",
    date: "2026-09-29",
    items: [
      { type: "changed", text: "Opens as a floating panel from an icon on the page, which can be dragged anywhere" },
      { type: "changed", text: "Available on Sales Navigator lead and people search pages and on public profiles" },
      { type: "changed", text: "Opening another lead or profile while the panel is open clears its fields" },
      { type: "removed", text: "The browser toolbar button: open the extension from the icon on the page" },
      { type: "fixed", text: "Works in Firefox 128 and later" },
      { type: "fixed", text: "Public profiles with many positions show all of them again" },
    ],
  },
  {
    version: "3.3.10",
    date: "2026-08-31",
    items: [
      { type: "added", text: "Extract works on public LinkedIn profile pages, not only in Sales Navigator" },
      { type: "added", text: "Export format setting: Get copies leads as tab-separated text or JSON" },
      { type: "added", text: "The company location filter and Country by default cover every country" },
      { type: "added", text: "More company legal forms are removed from company names" },
      { type: "changed", text: "Max saved leads is limited to 999" },
      { type: "fixed", text: "Company details load again after a LinkedIn layout change" },
    ],
  },
  {
    version: "3.3.9",
    date: "2026-08-14",
    items: [
      { type: "added", text: "Max saved leads setting, replacing the fixed limit of 99" },
      { type: "added", text: "The last 10 fetched companies are remembered, so their details load instantly" },
      { type: "added", text: "A pasted website URL is shortened to its domain" },
      { type: "fixed", text: "The refresh button re-fetches company details on the first click" },
      { type: "fixed", text: "Editing \"No website found\" clears the placeholder automatically" },
      { type: "fixed", text: "Names with any diacritic letters are extracted and transliterated in full" },
    ],
  },
  {
    version: "3.3.8",
    date: "2026-07-10",
    items: [
      { type: "added", text: "Store company id setting: Get can add the company's LinkedIn id as the last column" },
    ],
  },
  {
    version: "3.3.7",
    date: "2026-06-10",
    items: [
      { type: "fixed", text: "The website loading dots appear right after the text" },
      { type: "fixed", text: "Company details load correctly when the extension is used in several windows" },
    ],
  },
  {
    version: "3.3.6",
    date: "2026-06-10",
    items: [
      { type: "added", text: "Clean asks for confirmation before removing saved leads" },
      { type: "added", text: "Support for Microsoft Edge and Firefox" },
      { type: "changed", text: "Job title translation no longer needs a Google sign-in" },
      { type: "changed", text: "Clean is disabled when there are no saved leads" },
    ],
  },
  {
    version: "3.3.5",
    date: "2026-05-29",
    items: [
      { type: "changed", text: "Better overall quality and reliability" },
    ],
  },
  {
    version: "3.3.4",
    date: "2026-05-25",
    items: [
      { type: "added", text: "Members field: the company's number of LinkedIn members" },
      { type: "added", text: "Country by default setting, used when a company's country can't be found" },
      { type: "added", text: "The Get counter pops when the number of saved leads changes" },
      { type: "changed", text: "The LinkedIn button opens the company's public LinkedIn page" },
      { type: "changed", text: "The website icon is clickable only for a confirmed website" },
      { type: "fixed", text: "Save and Generate become available as soon as the data is filled in" },
      { type: "fixed", text: "An edited website is checked again right away" },
    ],
  },
  {
    version: "3.3.3",
    date: "2026-05-15",
    items: [
      { type: "added", text: "Refresh button to load a company's details again" },
      { type: "added", text: "LinkedIn button next to Company name, opening the company's page" },
      { type: "added", text: "Remember field order setting" },
      { type: "changed", text: "A lead can be saved without an email" },
      { type: "changed", text: "Companies are shown as an accordion with redesigned details" },
      { type: "changed", text: "Get copies fields in the order they're arranged in the panel" },
      { type: "fixed", text: "A field can be dropped anywhere on another field when reordering" },
    ],
  },
  {
    version: "3.3.2",
    date: "2026-05-06",
    items: [
      { type: "added", text: "Save, Get and Clean buttons to collect leads and copy them to a spreadsheet" },
      { type: "added", text: "\"No results\" when nothing was extracted or everything is filtered out" },
      { type: "changed", text: "The former Get button is now called Extract" },
      { type: "removed", text: "The Copy button" },
      { type: "fixed", text: "The first visible company is selected when the selected one is filtered out" },
    ],
  },
  {
    version: "3.3.1",
    date: "2026-04-28",
    items: [
      { type: "added", text: "Filters tab: filter companies by headquarters location and company size" },
      { type: "changed", text: "More reliable loading of company details" },
    ],
  },
  {
    version: "3.3.0",
    date: "2026-04-09",
    items: [
      { type: "added", text: "Tabs on the right: Actual experience and Settings" },
      { type: "added", text: "Settings to turn drag-and-drop and name transliteration on or off" },
      { type: "added", text: "Names in non-Latin scripts, such as Cyrillic, are kept as written" },
      { type: "added", text: "Company size shown for the selected company" },
      { type: "changed", text: "Only the tab content scrolls; the left side always stays in view" },
    ],
  },
  {
    version: "3.2.5",
    date: "2025-11-11",
    items: [
      { type: "added", text: "New email templates" },
      { type: "changed", text: "More time for company pages to load" },
    ],
  },
  {
    version: "3.2.4",
    date: "2025-10-15",
    items: [
      { type: "added", text: "All of a person's current positions are listed" },
      { type: "added", text: "Validate email button" },
      { type: "changed", text: "Better cleanup of company domains" },
      { type: "fixed", text: "Name transliteration and small display issues" },
    ],
  },
  {
    version: "3.2.3",
    date: "2025-07-04",
    items: [
      { type: "added", text: "An email can be entered before the company's website is found" },
      { type: "changed", text: "Better company details, website checks and name cleanup" },
    ],
  },
  {
    version: "3.2.2",
    date: "2025-06-13",
    items: [
      { type: "added", text: "Country and Industry fields for the selected company" },
      { type: "added", text: "Company details from the company's LinkedIn page" },
      { type: "added", text: "The company website can be edited" },
      { type: "changed", text: "Better email templates and full name detection" },
    ],
  },
  {
    version: "3.2.1",
    date: "2025-05-14",
    items: [
      { type: "added", text: "Email generation from the company website and the person's name" },
      { type: "added", text: "Generated emails are checked for deliverability" },
    ],
  },
  {
    version: "3.1.2",
    date: "2025-04-02",
    items: [
      { type: "added", text: "Clicking the company website copies a basic email address" },
      { type: "fixed", text: "The LinkedIn profile link is found correctly" },
    ],
  },
  {
    version: "3.1.1",
    date: "2025-03-03",
    items: [
      { type: "added", text: "The company website is checked for availability" },
      { type: "added", text: "Click the website to copy it, or its icon to open it" },
      { type: "changed", text: "Cleaner company names and experience list" },
      { type: "fixed", text: "Copied email addresses are lowercase" },
    ],
  },
  {
    version: "3.1.0",
    date: "2025-02-04",
    items: [
      { type: "added", text: "Company website shown with the experience" },
      { type: "changed", text: "More accurate translation and name cleanup" },
      { type: "changed", text: "Refreshed design" },
    ],
  },
  {
    version: "3.0.0",
    date: "2024-12-06",
    items: [
      { type: "added", text: "Works in LinkedIn Sales Navigator" },
      { type: "added", text: "Irish surname prefixes such as Mc, Mac and O' are handled" },
      { type: "added", text: "The extension's version is shown in the panel" },
      { type: "changed", text: "Cleaner company names and current experience" },
    ],
  },
  {
    version: "2.1.0",
    date: "2024-11-22",
    items: [
      { type: "added", text: "Name and surname transliteration" },
      { type: "changed", text: "Cleaner names and company names" },
    ],
  },
  {
    version: "2.0.0",
    date: "2024-11-13",
    items: [
      { type: "added", text: "First release" },
    ],
  },
];
