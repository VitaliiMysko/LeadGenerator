import { openCompanyLinkedinBtnElement } from "../../helper/dom-helper.js";

openCompanyLinkedinBtnElement.addEventListener("click", () => {
  const href = openCompanyLinkedinBtnElement.dataset.href;
  if (href) {
    chrome.tabs.create({ url: href });
  }
});
