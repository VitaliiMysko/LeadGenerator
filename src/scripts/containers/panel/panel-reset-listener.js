import { resetLeadData } from "./lead-reset.js";

const RESET_MESSAGE_TYPE = "lead-generator:panel-reset";
const PARENT_ORIGIN = "https://www.linkedin.com";

window.addEventListener("message", (event) => {
  if (event.origin !== PARENT_ORIGIN) return;
  if (event.data?.type !== RESET_MESSAGE_TYPE) return;
  resetLeadData();
});
