import { readFileSync } from "fs";
import { runInNewContext } from "vm";

// profile-url.js is a classic content script (no ES exports), so it's
// evaluated against a stub window instead of being imported.
const context = { window: {} };
runInNewContext(
  readFileSync(new URL("../src/utils/profile-url.js", import.meta.url), "utf8"),
  context,
);
const { toPublicProfileUrl } = context.window.leadGenerator;

describe("toPublicProfileUrl: public profile pages", () => {
  test.each([
    ["with trailing slash", "https://www.linkedin.com/in/john-doe/", "john-doe"],
    ["without trailing slash", "https://www.linkedin.com/in/john-doe", "john-doe"],
    ["with query", "https://www.linkedin.com/in/john-doe/?miniProfileUrn=abc", "john-doe"],
    ["with query, no slash", "https://www.linkedin.com/in/john-doe?trk=x", "john-doe"],
    ["with hash", "https://www.linkedin.com/in/john-doe#about", "john-doe"],
    ["sub-page", "https://www.linkedin.com/in/john-doe/details/experience/", "john-doe"],
    ["overlay", "https://www.linkedin.com/in/john-doe/overlay/contact-info/", "john-doe"],
    ["country subdomain", "https://pl.linkedin.com/in/john-doe", "john-doe"],
    ["no subdomain", "https://linkedin.com/in/john-doe/", "john-doe"],
    ["http", "http://www.linkedin.com/in/john-doe/", "john-doe"],
    ["surrounding whitespace", "  https://www.linkedin.com/in/john-doe/  ", "john-doe"],
    ["member id", "https://www.linkedin.com/in/ACwAAA1b2c3D4e5F/", "ACwAAA1b2c3D4e5F"],
    [
      "percent-encoded non-ASCII id",
      "https://www.linkedin.com/in/%D0%B8%D0%B2%D0%B0%D0%BD/",
      "%D0%B8%D0%B2%D0%B0%D0%BD",
    ],
  ])("%s", (_, url, id) => {
    expect(toPublicProfileUrl(url)).toBe(`https://www.linkedin.com/in/${id}/`);
  });
});

describe("toPublicProfileUrl: anything else", () => {
  test.each([
    ["Sales Navigator lead", "https://www.linkedin.com/sales/lead/ACwAAA1b2c3,NAME_SEARCH,xYz?_ntb=abc"],
    ["Sales Navigator people search", "https://www.linkedin.com/sales/search/people?query=x"],
    ["Sales Navigator company", "https://www.linkedin.com/sales/company/12345"],
    ["company page", "https://www.linkedin.com/company/acme/"],
    ["feed", "https://www.linkedin.com/feed/"],
    ["/in/ without an id", "https://www.linkedin.com/in/"],
    ["/in/ further down the path", "https://www.linkedin.com/sales/in/john-doe"],
    ["other domain", "https://example.com/in/john-doe"],
    ["look-alike domain", "https://notlinkedin.com/in/john-doe"],
    ["relative URL", "/in/john-doe"],
    ["empty string", ""],
    ["undefined", undefined],
    ["null", null],
  ])("%s", (_, url) => {
    expect(toPublicProfileUrl(url)).toBe("");
  });
});
