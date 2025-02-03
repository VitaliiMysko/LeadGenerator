window.leadGenerator = window.leadGenerator || {};

const waitForElementWithTimeout = (selector, timeout = 5000) => {
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

window.leadGenerator.waitForElementWithTimeout = waitForElementWithTimeout;
