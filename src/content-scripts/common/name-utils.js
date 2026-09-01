window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.nameUtilsInit) {
  window.leadGenerator.nameUtils = window.leadGenerator.nameUtils || {};

  (() => {
    function handleFullName(str) {
      const hasCyrillic = /\p{Script=Cyrillic}/u.test(str);
      if (hasCyrillic) {
        return str
        .trim()
        .split(/\s+/)
        .join(" ");
      }

      // \P{L} (not a Unicode letter) covers any script, not just the hand-picked
      // Latin-1/Latin Extended-A range used previously, which incorrectly ate into
      // names whose first letter falls just outside that narrower range.
      str = str.replace(/^\P{L}+/u, "");
      // Removes the prefix dr/Dr/prof/Prof before the full name
      str = str
        .trim()
        .replace(
          /^(prof\.?\s+)?(prof\.?|prof,?|dr\.?|dr,?|dr\.-ing\.?)\s+(?=\p{L})/iu,
          ""
        );
      const [textBeforeComma] = str.split(",");
      const dutchSurnames = window.leadGenerator.constants.dutchSurnames;

      return textBeforeComma
        .trim()
        .split(/\s+/) // Break the line into words, given a few spaces
        .map((word) => {
          if (dutchSurnames.includes(word.toLowerCase())) {
            return word.toLowerCase();
          }
          if (word.match(/^(Mc|Mac)([A-Z])/)) {
            return word; // Capital letter after prefix Mc/Mac isn't changed to lowercase
          }
          return word
            .split("-")
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join("-");
        })
        .join(" ");
    }

    function getFirstName(fullName) {
      return fullName.split(" ")[0] || "";
    }

    function getSecondName(fullName) {
      const parts = fullName.split(" ");
      let secondName = parts.length > 1 ? parts.slice(1).join(" ") : "";

      if (secondName.includes("'")) {
        secondName = secondName.replace(/'\p{L}/gu, (match) => match.toUpperCase());
      }

      return secondName;
    }

    window.leadGenerator.nameUtils.handleFullName = handleFullName;
    window.leadGenerator.nameUtils.getFirstName = getFirstName;
    window.leadGenerator.nameUtils.getSecondName = getSecondName;
  })();

  window.leadGenerator.nameUtilsInit = true;
}
