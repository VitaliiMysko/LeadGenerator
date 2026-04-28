const STORAGE_KEY = "filters";

let state = {
  companyLocation: [],
  companySize: [],
};

let listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((fn) => fn(state));
}

export function getState() {
  return state;
}

export async function setFilter(key, values) {
  state[key] = values;

  notify();
  await saveToStorage();
}

async function saveToStorage() {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: state }, resolve);
  });
}

export async function loadFilters() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
      if (data[STORAGE_KEY]) {
        state = data[STORAGE_KEY];
      }
      resolve();
    });
  });
}
