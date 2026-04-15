const STORAGE_KEY = "filters";

let state = {
  companyLocation: [],
};

let listeners = new Set();

// --------------------
// SUBSCRIBE
// --------------------
export function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

// --------------------
// NOTIFY
// --------------------
function notify() {
  listeners.forEach((fn) => fn(state));
}

// --------------------
// GET STATE
// --------------------
export function getState() {
  return state;
}

// --------------------
// UPDATE STATE
// --------------------
export async function setFilter(key, values) {
  state[key] = values;

  notify();
  await saveToStorage();
}

// --------------------
// STORAGE
// --------------------
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
