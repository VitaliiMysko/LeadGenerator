(() => {
  const waitForConditionWithTimeout =
    window.leadGenerator.waitForConditionWithTimeout;

  (async () => {
    let entries = [];

    try {
      const container = await waitForConditionWithTimeout(
        window.leadGenerator.experienceData.findDetailsContainer,
        8000,
      );

      entries =
        window.leadGenerator.experienceData.extractEntriesFromContainer(
          container,
        ).entries;
    } catch (error) {
      console.error("Error extracting full experience list:", error);
    } finally {
      chrome.runtime.sendMessage({
        action: "linkedinProfileExperienceContent",
        data: entries,
      });
    }
  })();
})();
