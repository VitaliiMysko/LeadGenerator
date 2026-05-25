window.leadGenerator = window.leadGenerator || {};

const waitForElementWithTimeout = (selector, timeout = 4000) => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Selector "${selector}" has not been found for ${timeout} ms.`));
    }, timeout);

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        clearTimeout(timer);
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
};

const waitForElementById = (id, conditionFn = () => true, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const check = () => {
      const el = document.getElementById(id);
      if (el && conditionFn(el)) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    };

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element #${id} did not appear in ${timeout}ms`));
    }, timeout);

    check();
  });
};

window.leadGenerator.waitForElementWithTimeout = waitForElementWithTimeout;
window.leadGenerator.waitForElementById = waitForElementById;
