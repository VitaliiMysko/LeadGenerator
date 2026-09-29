import { getWorkerUrl } from "../../constants/config.js";
import {
  getTranslateBtnElement,
  getJobPositionElement,
} from "../helper/dom-helper.js";
import { useTextChangeEffect } from "../helper/dom-action.js";
import { fetchWorkerJson } from "./worker-client.js";

getTranslateBtnElement().addEventListener("click", async () => {
  const text = getJobPositionElement().value;
  if (!text) return;

  try {
    const data = await fetchWorkerJson(getWorkerUrl(), {
      method: "POST",
      body: { text, target: "en" },
    });

    if (data?.data?.translations) {
      getJobPositionElement().value = data.data.translations[0].translatedText
        .replace(/^([a-z])/, (match) => match.toUpperCase())
        .replace(/&amp;/g, "&");
      useTextChangeEffect(getJobPositionElement());
    } else {
      console.error("Translation error:", data);
    }
  } catch (error) {
    console.error("Translation failed:", error);
  }
});
