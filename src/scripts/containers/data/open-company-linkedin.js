import { getOpenCompanyLinkedinBtnElement } from "../../helper/dom-helper.js";
import { openTab } from "../../services/tab-bridge.js";

const openCompanyLinkedinBtnElement = getOpenCompanyLinkedinBtnElement();

openCompanyLinkedinBtnElement.addEventListener("click", () => {
  const href = openCompanyLinkedinBtnElement.dataset.href;
  if (href) {
    openTab(href.replace("/sales/", "/"));
  }
});
