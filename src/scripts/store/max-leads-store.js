import { syncGet, syncSet } from "../utils/chrome-storage.js";
import { DEFAULT_MAX_SAVED_LEADS } from "../../constants/config.js";

const STORAGE_KEY = "maxSavedLeads";

let state = DEFAULT_MAX_SAVED_LEADS;

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

export function getMaxSavedLeads() {
  return state;
}

export async function setMaxSavedLeads(value) {
  state = value;
  notify();
  await syncSet(STORAGE_KEY, state);
}

export async function loadMaxSavedLeads() {
  const saved = await syncGet(STORAGE_KEY, DEFAULT_MAX_SAVED_LEADS);
  state = saved ?? DEFAULT_MAX_SAVED_LEADS;
  notify();
  return state;
}
