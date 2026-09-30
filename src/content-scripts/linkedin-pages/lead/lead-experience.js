if (!window.leadGenerator.experienceDataInit) {
  window.leadGenerator.experienceData =
    window.leadGenerator.experienceData || {};

  (() => {
    // LinkedIn's public profile page renders each experience item's job
    // title / company name / employment type / date range / location as
    // sibling <p>s with no distinguishing class (all hashed per-build) or
    // attribute. Only the date range has a recognizable, stable *shape*
    // ("Oct 2022 - Present · 4 yrs", "2014 – Jun 2015"), so it's found by
    // content pattern rather than position, mirroring company.js's existing
    // "match by visible content, not class" approach for this same page family.
    const MONTH = "[A-Za-z]{3,9}\\.?\\s";
    const DATE_RANGE_REGEX = new RegExp(
      `^(?:${MONTH})?\\d{4}\\s*[-–]\\s*(?:Present|(?:${MONTH})?\\d{4})(?:\\s*·.*)?$`,
      "i",
    );
    // Total-tenure line shown next to a multi-position company's name, e.g. "9 yrs 4 mos".
    const DURATION_ONLY_REGEX = /^\d+\s*yrs?(\s+\d+\s*mos?)?$|^\d+\s*mos?$/i;

    function isCurrentPeriodText(text) {
      const trimmed = text.trim();
      return trimmed === "" || /\bpresent\b/i.test(trimmed);
    }

    function emptyExtraData() {
      return { location: "", industry: "", companySize: "", revenue: "" };
    }

    function getCompanyLink(scopeEl) {
      const linkElement = scopeEl.querySelector('a[href*="/company/"]');
      return linkElement ? linkElement.href.split("?")[0] : "";
    }

    function removeCompanyStatusRegex() {
      const companyStatus = window.leadGenerator.constants.companyStatus;
      return new RegExp(
        `[\\s,]+(${companyStatus.join("|")})([.,](?=\\s|$)|\\s|$).*$`,
        "i",
      );
    }

    // The single-position (no <ul>) shape sometimes appends the employment
    // type straight onto the company-name paragraph instead of rendering it
    // as a separate <p>, e.g. "Global Message Services · Full-time" — cut
    // off everything from that " · " separator onward.
    function stripTrailingMetadata(text) {
      const separatorIndex = text.indexOf(" · ");
      return separatorIndex === -1 ? text : text.slice(0, separatorIndex);
    }

    function cleanCompanyName(name) {
      const regex = removeCompanyStatusRegex();
      return stripTrailingMetadata(name.trim())
        .trim()
        .replace(/\p{Extended_Pictographic}/gu, "")
        .replace(regex, "");
    }

    function getParagraphTexts(scopeEl) {
      return [...scopeEl.querySelectorAll("p")]
        .map((p) => p.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean);
    }

    function getHeaderCompany(item, ul) {
      const companyLink = getCompanyLink(item);

      const headerPs = [...item.querySelectorAll("p")]
        .filter((p) => !ul.contains(p))
        .map((p) => p.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean);

      const companyNameRaw =
        headerPs.find((text) => !DURATION_ONLY_REGEX.test(text)) ??
        headerPs[0] ??
        "";

      return { companyName: cleanCompanyName(companyNameRaw), companyLink };
    }

    const ITEM_SELECTOR = '[componentkey^="entity-collection-item-"]';

    // Items sit at different depths: direct children of the profile's short
    // Experience section, but wrapped in extra <div>s on the
    // /details/experience/ page. Take every item that isn't nested inside
    // another item of the same container.
    function getTopLevelItems(container) {
      return [...container.querySelectorAll(ITEM_SELECTOR)].filter((item) => {
        const parentItem = item.parentElement?.closest(ITEM_SELECTOR);
        return !parentItem || !container.contains(parentItem);
      });
    }

    // A multi-position company lists its positions in a <ul>; look below the
    // item's direct children too, for the same wrapping reason.
    function getPositionsList(item) {
      return item.querySelector(":scope > ul") ?? item.querySelector("ul:has(> li)");
    }

    // Walks the experience entries from most-recent to oldest, collecting
    // only the profile's *current* position(s) and stopping at the first
    // past one (positions are always rendered newest-first), mirroring the
    // termination logic of the Sales Navigator version.
    function extractEntriesFromContainer(container) {
      const entries = [];
      if (!container) return { entries, reachedEndCurrently: false };

      let reachedEndCurrently = true;
      const items = getTopLevelItems(container);
      let id = 0;

      itemLoop: for (const item of items) {
        const ul = getPositionsList(item);

        if (ul) {
          const { companyName, companyLink } = getHeaderCompany(item, ul);
          const positions = ul.querySelectorAll(":scope > li");
          let hasCurrentPosition = false;

          for (const position of positions) {
            const ps = getParagraphTexts(position);
            const jobPosition = ps[0] || "";
            if (!jobPosition) continue;

            const dateText = ps.find((text) => DATE_RANGE_REGEX.test(text)) ?? "";

            if (isCurrentPeriodText(dateText)) {
              hasCurrentPosition = true;
              entries.push({
                id: ++id,
                companyName,
                jobPosition,
                companyLink,
                extraData: emptyExtraData(),
              });
            } else {
              reachedEndCurrently = false;
              break itemLoop;
            }
          }

          if (!hasCurrentPosition) {
            reachedEndCurrently = false;
            break itemLoop;
          }
        } else {
          const ps = getParagraphTexts(item);
          const jobPosition = ps[0] || "";
          const companyNameRaw = ps[1] || "";

          if (!jobPosition || !companyNameRaw) {
            reachedEndCurrently = false;
            break itemLoop;
          }

          const dateText = ps.find((text) => DATE_RANGE_REGEX.test(text)) ?? "";

          if (isCurrentPeriodText(dateText)) {
            entries.push({
              id: ++id,
              companyName: cleanCompanyName(companyNameRaw),
              jobPosition,
              companyLink: getCompanyLink(item),
              extraData: emptyExtraData(),
            });
          } else {
            reachedEndCurrently = false;
            break itemLoop;
          }
        }
      }

      return { entries, reachedEndCurrently };
    }

    const TOP_LEVEL_SECTION_SELECTOR = '[data-testid^="profile_ExperienceTopLevelSection_"]';
    const DETAILS_SECTION_SELECTOR = '[data-testid^="profile_ExperienceDetailsSection_"]';
    const REVEAL_STEP_WAIT_MS = 400;
    const REVEAL_MAX_STEPS = 20;

    // The page may scroll inside its own container rather than the document,
    // so use the nearest scrollable ancestor of <main>, falling back to the
    // document.
    function findScrollContainer() {
      const isScrollable = (el) =>
        /(auto|scroll|overlay)/.test(getComputedStyle(el).overflowY) &&
        el.scrollHeight > el.clientHeight + 1;

      for (let el = document.querySelector("main"); el && el !== document.body; el = el.parentElement) {
        if (isScrollable(el)) return el;
      }
      return document.scrollingElement || document.documentElement;
    }

    // LinkedIn only renders the profile's lower sections, Experience
    // included, once they're scrolled near the viewport. If it isn't in the
    // DOM yet, scroll down a screen at a time until it appears (or the page
    // ends), then put the scroll position back where the user left it.
    async function revealTopLevelSection() {
      const waitForConditionWithTimeout = window.leadGenerator.waitForConditionWithTimeout;
      const scroller = findScrollContainer();
      const originalTop = scroller.scrollTop;
      // "instant" overrides any scroll-behavior: smooth the page sets.
      const scrollToTop = (top) => scroller.scrollTo({ top, behavior: "instant" });

      try {
        for (let step = 0; step < REVEAL_MAX_STEPS; step++) {
          const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
          scrollToTop(scroller.scrollTop + scroller.clientHeight);

          const found = await waitForConditionWithTimeout(
            () => document.querySelector(TOP_LEVEL_SECTION_SELECTOR),
            REVEAL_STEP_WAIT_MS,
          ).catch(() => null);
          if (found) return found;
          if (atBottom) return null;
        }
        return null;
      } finally {
        scrollToTop(originalTop);
      }
    }

    async function getActualExperienceData() {
      let topLevelContainer = document.querySelector(TOP_LEVEL_SECTION_SELECTOR);

      if (!topLevelContainer) {
        // Handles the edge case where the user is already on the
        // /details/experience/ page when clicking Extract.
        const detailsContainer = document.querySelector(DETAILS_SECTION_SELECTOR);
        if (detailsContainer) {
          const { entries } = extractEntriesFromContainer(detailsContainer);
          return { entries, needsFullExperience: { needed: false, url: "" } };
        }
        topLevelContainer = await revealTopLevelSection();
      }

      const { entries, reachedEndCurrently } =
        extractEntriesFromContainer(topLevelContainer);

      // Matches on the href, not the (potentially localized) aria-label text.
      // Contains rather than ends-with: LinkedIn appends query parameters
      // (e.g. ?locale=en-US&vieweeProfileId=...).
      const showAllLink = document.querySelector('a[href*="/details/experience"]');

      const needsFullExperience =
        showAllLink && reachedEndCurrently && entries.length > 0
          ? { needed: true, url: showAllLink.href }
          : { needed: false, url: "" };

      return { entries, needsFullExperience };
    }

    window.leadGenerator.experienceData.getActualExperienceData = getActualExperienceData;
    window.leadGenerator.experienceData.extractEntriesFromContainer = extractEntriesFromContainer;
  })();

  window.leadGenerator.experienceDataInit = true;
}
