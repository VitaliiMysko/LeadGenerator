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
  getActualExperiencesData =
    window.leadGenerator.experienceData.getActualExperiencesData;
  window.leadGenerator.experienceDataDeclared = true;
}

async function getData() {
  let data = [];
  let personalData = [];
  let actualExperiencesData = [];

  try {
    personalData = await getPersonalData();
    actualExperiencesData = getActualExperiencesData();
  } catch (error) {
    console.error("Problems with getting data", error.message);
  }

  data.push({ category: "personalData", value: personalData });
  data.push({
    category: "actualExperiencesData",
    value: actualExperiencesData,
  });

  return data;
}
