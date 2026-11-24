window.leadGenerator = window.leadGenerator || {};

(() => {
  // Profile names sometimes carry emoji ("Schimmel 🔥", "Wilbrink ☀️",
  // "Jansen 🇳🇱"). Removed by Unicode property, so it works for any script:
  // pictographs, skin-tone modifiers, flag letters, and the invisible joiners,
  // variation selectors, keycap marks and tag characters emoji are built from.
  const EMOJI_REGEX =
    /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}‍︎️⃣\u{E0020}-\u{E007F}]/gu;

  function stripEmoji(text) {
    return text.replace(EMOJI_REGEX, " ").split(/\s+/).filter(Boolean).join(" ");
  }

  window.leadGenerator.stripEmoji = stripEmoji;
})();
