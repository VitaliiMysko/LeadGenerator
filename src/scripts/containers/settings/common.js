export function getFromStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => {
      resolve(data[key]);
    });
  });
}

export function setToStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(value);
      }
    });
  });
}
