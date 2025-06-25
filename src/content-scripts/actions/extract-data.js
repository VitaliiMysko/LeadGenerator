if (!window.messageListenerAdded) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData") {
      (async () => {
        const data = await getData();
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

async function getData() {
  let data = [];
  let personalData = [];
  let actualExperienceData = [];

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
