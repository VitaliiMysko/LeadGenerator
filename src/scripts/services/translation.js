import {
  translateBtnElement,
  jobPositionElement,
} from "../helper/dom-helper.js";

translateBtnElement.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
    if (response.success) {
      translateText(response.token);
      jobPositionElement.classList.add("update-effect");

      setTimeout(() => {
        jobPositionElement.classList.remove("update-effect");
      }, 1000);
    } else {
      console.error("Error authorization:", response.error);
    }
  });
});

function translateText(token) {
  const url = "https://translation.googleapis.com/language/translate/v2";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      q: jobPositionElement.value,
      target: "en",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data && data.data.translations) {
        const translations = data.data.translations;
        jobPositionElement.value = translations[0].translatedText
          .replace(/^([a-z])/, (match) => match.toUpperCase())
          .replace(/&amp;/g, '&');
      } else {
        console.error("Error translating:", data);
      }
    })
    .catch((error) =>
      console.error("Error query to translation service:", error)
    );
}
