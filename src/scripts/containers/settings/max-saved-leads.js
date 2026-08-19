import { showAlert } from "../../output/alert.js";
import { showConfirm } from "../../output/confirm.js";
import { localGet, localSet } from "../../utils/chrome-storage.js";
import { MAX_SAVED_LEADS_LIMIT } from "../../../constants/config.js";
import {
  loadMaxSavedLeads,
  getMaxSavedLeads,
  setMaxSavedLeads,
} from "../../store/max-leads-store.js";

const LEADS_STORAGE_KEY = "saved_leads";

export async function initMaxSavedLeads() {
  const inputElement = document.getElementById("max-saved-leads-settings");
  if (inputElement == null) return;

  const current = await loadMaxSavedLeads();
  inputElement.value = current;

  inputElement.addEventListener("input", () => {
    inputElement.value = inputElement.value.replace(/\D/g, "").slice(0, 4);
  });

  inputElement.addEventListener("blur", () => handleBlur(inputElement));
}

async function handleBlur(inputElement) {
  const raw = inputElement.value.trim();
  const previous = getMaxSavedLeads();
  const parsed = Number(raw);

  if (!raw || !Number.isInteger(parsed) || parsed < 1 || parsed > MAX_SAVED_LEADS_LIMIT) {
    inputElement.value = previous;
    showAlert(`Enter a number between 1 and ${MAX_SAVED_LEADS_LIMIT}`, "error");
    return;
  }

  if (parsed === previous) {
    inputElement.value = parsed;
    return;
  }

  const leads = await localGet(LEADS_STORAGE_KEY, []);

  if (leads.length > parsed) {
    const excess = leads.length - parsed;
    const confirmed = await showConfirm(
      `Lowering the limit to ${parsed} will delete the ${excess} oldest saved lead(s). Continue?`,
    );

    if (!confirmed) {
      inputElement.value = previous;
      return;
    }

    await localSet(LEADS_STORAGE_KEY, leads.slice(excess));
  }

  await setMaxSavedLeads(parsed);
  inputElement.value = parsed;
  showAlert("Saved", "success");
}
