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

  const FIELDS = ["website", "industry", "size", "headquarters"];
  const LABELS_BY_LANGUAGE = Object.values(window.leadGenerator.companyLabels);

  // Zero digit of each script LinkedIn may use: Latin, Arabic-Indic, Persian,
  // Devanagari, Bengali, Gurmukhi, Telugu, Thai.
  const DIGIT_ZEROS = [
    0x30, 0x660, 0x6f0, 0x966, 0x9e6, 0xa66, 0xc66, 0xe50,
  ];

  (async () => {
    try {
      const labels = await waitForConditionWithTimeout(detectPageLabels, 8000);

      data.website = getValueForLabels(labels.website);

      if (!data.location) {
        data.location = getValueForLabels(labels.headquarters);
      }

      if (!data.industry) {
        data.industry = getValueForLabels(labels.industry);
      }

      if (!data.size) {
        data.size = getValueForLabels(labels.size);
      }

      data.members = getMembersCount(labels.members);
    } catch (error) {
      console.error("Error finding element:", error);
    } finally {
      chrome.runtime.sendMessage({ action: "linkedinCompanyPageContent", data });
    }
  })();

  // Field labels follow the language set in the user's LinkedIn profile. The
  // page's language is the one with the most labels present, and only its
  // labels are used afterwards, so a short word of another language can't
  // match by accident.
  function detectPageLabels() {
    const texts = new Set(
      [...document.querySelectorAll("p, h3")].map((element) =>
        normalize(element.textContent),
      ),
    );

    let best = null;
    let bestCount = 0;
    for (const labels of LABELS_BY_LANGUAGE) {
      const count = FIELDS.filter((field) =>
        labels[field].some((label) => texts.has(normalize(label))),
      ).length;
      if (count > bestCount) {
        best = labels;
        bestCount = count;
      }
    }
    return best;
  }

  function normalize(text) {
    return text.trim().toLowerCase().replace(/[’`]/g, "'");
  }

  // LinkedIn's overview section no longer uses a <dl>/<dt>/<dd> list under a
  // stable class name; it renders each field as two sibling divs (label, then
  // value) under CSS classes that are hashed per-build and unusable as
  // selectors. Match on the visible label text instead.
  function findLabelElement(labels) {
    const normalizedLabels = labels.map(normalize);
    const candidates = document.querySelectorAll("p, h3");
    for (const candidate of candidates) {
      if (normalizedLabels.includes(normalize(candidate.textContent))) {
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

  // The "N associated members" link: its text holds a number and one of the
  // language's member word stems, in whatever word order the language uses.
  // The number may be written in the language's own digits.
  function getMembersCount(memberStems) {
    const stems = memberStems.map(normalize);
    const links = document.querySelectorAll("a");
    for (const link of links) {
      const text = normalize(link.textContent);
      if (!stems.some((stem) => text.includes(stem))) continue;
      const match = text.match(/\p{Nd}[\p{Nd}.,\s ٫٬]*/u);
      if (match) {
        return toAsciiDigits(match[0]);
      }
    }
    return "";
  }

  function toAsciiDigits(text) {
    let digits = "";
    for (const char of text) {
      const codePoint = char.codePointAt(0);
      const zero = DIGIT_ZEROS.find(
        (start) => codePoint >= start && codePoint <= start + 9,
      );
      if (zero !== undefined) digits += codePoint - zero;
    }
    return digits;
  }
})();
