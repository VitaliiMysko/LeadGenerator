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

if (!window.leadGenerator.personalDataDeclared) {
  getPersonalData = window.leadGenerator.personalData.getPersonalData;
  window.leadGenerator.personalDataDeclared = true;
}

if (!window.leadGenerator.experienceDataDeclared) {
  getActualExperienceData =
    window.leadGenerator.experienceData.getActualExperienceData;
  window.leadGenerator.experienceDataDeclared = true;
}

async function extractData() {
  let data = [];
  let personalData = [];
  let actualExperienceData = [];

  const showAllPositionsButton = document.querySelector(".show-all-button");

  if (showAllPositionsButton) {
    const showAllPositionsButtonState =
      showAllPositionsButton.getAttribute("aria-expanded");

    if (showAllPositionsButtonState === "false") {
      showAllPositionsButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  try {
    personalData = await getPersonalData();
    actualExperienceData = await getActualExperienceData();
  } catch (error) {
    console.error("Problems with getting data", error.message);
  }

  data.push({ category: "personalData", value: personalData });
  data.push({
    category: "actualExperienceData",
    value: actualExperienceData,
  });

  return data;
}
