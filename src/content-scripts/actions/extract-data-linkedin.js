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
  let personalData = [];
  let actualExperienceData = [];
  let needsFullExperience = { needed: false, url: "" };

  try {
    personalData = await window.leadGenerator.personalData.getPersonalData();
    const experienceResult =
      await window.leadGenerator.experienceData.getActualExperienceData();
    actualExperienceData = experienceResult.entries;
    needsFullExperience = experienceResult.needsFullExperience;
  } catch (error) {
    console.error("Problems with getting data", error.message);
  }

  return [
    { category: "personalData", value: personalData },
    { category: "actualExperienceData", value: actualExperienceData },
    { category: "needsFullExperience", value: needsFullExperience },
  ];
}
