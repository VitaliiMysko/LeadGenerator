import { getWorkerUrl } from "../../constants/config.js";

export const emailDataByDefault = {
  email: "",
  message: "Email not found!",
  ok: false,
  error: false,
  invalidDomain: false,
  unknown: false,
};

export async function verifyEmail(email) {
  const workerUrl = `${getWorkerUrl()}?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(workerUrl);
    const result = await response.json();
    return { state: result.state, reason: result.reason, error: "" };
  } catch (error) {
    console.error("Email verification failed:", error);
    return { state: "", reason: "", error: error.message };
  }
}

export function parseVerifyResult(result, emailData) {
  if (result.state === "deliverable") {
    emailData.ok = true;
    emailData.message = "Email found";
  }
  if (result.state === "unknown") {
    emailData.unknown = true;
    emailData.message = "There are unknown emails. Please, recheck it later";
  }
  if (result.state === "undeliverable" && result.reason === "invalid_domain") {
    emailData.invalidDomain = true;
    emailData.message = "Email not found. Domain is invalid";
  }
  if (result.error !== "") {
    emailData.error = true;
    emailData.message = `Email verification failed: ${result.error}`;
  }
}
