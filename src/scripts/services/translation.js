import {
  getTranslateBtnElement,
  getJobPositionElement,
} from "../helper/dom-helper.js";

import { useTextChangeEffect } from "../helper/dom-action.js";

getTranslateBtnElement().addEventListener("click", async () => {
  try {
    const response = await chrome.runtime.sendMessage({ action: "getAuthToken" });
    if (response.success) {
      await translateText(response.token);
      useTextChangeEffect(getJobPositionElement());
    } else {
      console.error("Error authorization:", response.error);
    }
  } catch (error) {
    console.error("Error authorization:", error);
  }
});

async function translateText(token) {
  const url = "https://translation.googleapis.com/language/translate/v2";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        q: getJobPositionElement().value,
        target: "en",
      }),
    });

    const data = await response.json();

    if (data?.data?.translations) {
      getJobPositionElement().value = data.data.translations[0].translatedText
        .replace(/^([a-z])/, (match) => match.toUpperCase())
        .replace(/&amp;/g, "&");
    } else {
      console.error("Error translating:", data);
    }
  } catch (error) {
    console.error("Error query to translation service:", error);
  }
}
