import { getOpenCompanyLinkedinBtnElement } from "../../helper/dom-helper.js";

const openCompanyLinkedinBtnElement = getOpenCompanyLinkedinBtnElement();

openCompanyLinkedinBtnElement.addEventListener("click", () => {
  const href = openCompanyLinkedinBtnElement.dataset.href;
  if (href) {
    chrome.tabs.create({ url: href.replace("/sales/", "/"), active: false });
  }
});
