window.leadGenerator = window.leadGenerator || {};

const waitForElementWithTimeout = (selector, timeout = 2000) => {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      // attributes: true,
      // subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(
        new Error(
          `Selector "${selector}" has not been found for ${timeout} ms.`
        )
      );
    }, timeout);
  });
};

const waitForElementById = (id, conditionFn = () => true, timeout = 5000) => {
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
      reject(`Element #${id} did not appear in ${timeout}ms`);
    }, timeout);

    check();
  });
};

window.leadGenerator.waitForElementWithTimeout = waitForElementWithTimeout;
window.leadGenerator.waitForElementById = waitForElementById;
