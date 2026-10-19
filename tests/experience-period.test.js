import { readFileSync } from "fs";
import { runInNewContext } from "vm";

// experience-period.js is a classic content script (no ES exports), so it's
// evaluated against a stub window instead of being imported.
const context = { window: {} };
runInNewContext(
  readFileSync(new URL("../src/utils/experience-period.js", import.meta.url), "utf8"),
  context,
);
const { parseExperiencePeriod } = context.window.leadGenerator;

describe("parseExperiencePeriod: current positions", () => {
  test.each([
    ["English", "Oct 2022 - Present · 4 yrs"],
    ["Sales Navigator, no spaces", "Jan 2024–Present"],
    ["German", "Jan. 2024 – Heute · 2 J. 10 Mon."],
    ["Spanish", "ene. 2024 - actualidad · 2 años 10 meses"],
    ["French", "janv. 2024 - aujourd’hui · 2 ans 10 mois"],
    ["Dutch", "jan 2024 - heden · 2 jaar 10 maanden"],
    ["Portuguese", "jan. de 2024 - o momento · 2 anos 10 meses"],
    ["Czech", "led 2024 – současnost · 2 roky 10 měsíců"],
    ["Russian", "янв. 2024 г. – настоящее время · 2 года 10 месяцев"],
    ["Persian", "Jan 2024‏ - تاکنون · ‏۲‏ ‏سال‏"],
    ["Hindi", "Jan 2024 - अभी तक · 2 साल 10 महीने"],
    ["Hebrew", "Jan 2024‏ - נוכחי · ‏2‏ ‏שנתיים‏"],
    ["Japanese", "2024年1月 - 現在 · 2年10ヶ月"],
    ["Korean", "2024년 1월 - 현재 · 2년 10개월"],
    ["Thai", "ม.ค. 2024 - ปัจจุบัน · 2 ปี 10 เดือน"],
    ["Chinese (Traditional)", "2024 年 1 月 - 現在 · 2 年 10 個月"],
  ])("%s", (_, text) => {
    expect(parseExperiencePeriod(text)).toEqual({ isCurrent: true });
  });
});

describe("parseExperiencePeriod: past positions", () => {
  test.each([
    ["English, years only", "2014 – 2015"],
    ["English, months", "Jan 2014 - Jun 2015 · 1 yr 6 mos"],
    ["German", "Jan. 2014 – Juni 2015 · 1 J. 6 Mon."],
    ["Japanese", "2014年1月 - 2015年6月 · 1年6ヶ月"],
    ["Persian digits", "۲۰۱۴ - ۲۰۱۵"],
  ])("%s", (_, text) => {
    expect(parseExperiencePeriod(text)).toEqual({ isCurrent: false });
  });
});

describe("parseExperiencePeriod: other text", () => {
  test.each([
    ["job title", "Senior Software Engineer"],
    ["company with employment type", "Acme · Full-time"],
    ["location", "Kyiv, Ukraine · On-site"],
    ["duration only", "9 yrs 4 mos"],
    ["year far from the dash", "Responsible for the 2019 migration of billing - and more"],
  ])("%s returns null", (_, text) => {
    expect(parseExperiencePeriod(text)).toBeNull();
  });
});
