export function syncGet(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => resolve(data[key]));
  });
}

export function syncSet(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

export function localGet(key, defaultValue = undefined) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => {
      resolve(key in data ? data[key] : defaultValue);
    });
  });
}

export function localSet(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
