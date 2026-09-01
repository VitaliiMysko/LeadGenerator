(() => {
  const waitForConditionWithTimeout =
    window.leadGenerator.waitForConditionWithTimeout;

  const initData = window.leadGeneratorInitData || {};

  const data = {
    url: window.location.href,
    website: "",
    location: initData.location || "",
    industry: initData.industry || "",
    size: initData.size || "",
    members: "",
    error: "",
  };

  const LABELS = {
    website: ["Website", "Вебсайт"],
    industry: ["Industry", "Галузь"],
    size: ["Company size", "Розмір компанії"],
    headquarters: ["Headquarters", "Штаб-квартира"],
  };

  const ALL_LABELS = Object.values(LABELS).flat();

  (async () => {
    try {
      await waitForConditionWithTimeout(
        () => findLabelElement(ALL_LABELS),
        8000,
      );

      data.website = getValueForLabels(LABELS.website);

      if (!data.location) {
        data.location = getValueForLabels(LABELS.headquarters);
      }

      if (!data.industry) {
        data.industry = getValueForLabels(LABELS.industry);
      }

      if (!data.size) {
        data.size = getValueForLabels(LABELS.size);
      }

      data.members = getMembersCount();
    } catch (error) {
      console.error("Error finding element:", error);
    } finally {
      chrome.runtime.sendMessage({ action: "linkedinCompanyPageContent", data });
    }
  })();

  // LinkedIn's overview section no longer uses a <dl>/<dt>/<dd> list under a
  // stable class name; it renders each field as two sibling divs (label, then
  // value) under CSS classes that are hashed per-build and unusable as
  // selectors. Match on the visible label text instead.
  function findLabelElement(labels) {
    const candidates = document.querySelectorAll("p, h3");
    for (const candidate of candidates) {
      if (labels.includes(candidate.textContent.trim())) {
        return candidate;
      }
    }
    return null;
  }

  function getValueForLabels(labels) {
    const labelElement = findLabelElement(labels);
    const valueContainer = labelElement?.parentElement?.nextElementSibling;
    return valueContainer ? valueContainer.textContent.trim() : "";
  }

  function getMembersCount() {
    const links = document.querySelectorAll("a");
    for (const link of links) {
      const match = link.textContent
        .trim()
        .match(/^([\d,\s]+)\s+associated members$/i);
      if (match) {
        return match[1].replace(/[,\s]/g, "");
      }
    }
    return "";
  }
})();
