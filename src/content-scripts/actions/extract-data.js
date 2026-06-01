if (!window.messageListenerAdded) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractData") {
      (async () => {
        const data = await extractData();
        sendResponse({ data });
      })();
      return true;
    }
  });

  window.messageListenerAdded = true;
}

async function extractData() {
  const showAllPositionsButton = document.querySelector(".show-all-button");

  if (showAllPositionsButton) {
    if (showAllPositionsButton.getAttribute("aria-expanded") === "false") {
      showAllPositionsButton.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  let personalData = [];
  let actualExperienceData = [];

  try {
    personalData = await window.leadGenerator.personalData.getPersonalData();
    actualExperienceData = await window.leadGenerator.experienceData.getActualExperienceData();
  } catch (error) {
    console.error("Problems with getting data", error.message);
  }

  return [
    { category: "personalData", value: personalData },
    { category: "actualExperienceData", value: actualExperienceData },
  ];
}
