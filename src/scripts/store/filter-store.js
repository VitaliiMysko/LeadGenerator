import { syncGet, syncSet } from "../utils/chrome-storage.js";

const STORAGE_KEY = "filters";

let state = {
  companyLocation: [],
  companySize: [],
};

const listeners = new Set();

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
  await syncSet(STORAGE_KEY, state);
}

export async function loadFilters() {
  const saved = await syncGet(STORAGE_KEY);
  if (saved) state = saved;
}
