import { formatCompanySize } from "../src/utils/company-size.js";

describe("formatCompanySize", () => {
  test("null returns unknown", () => expect(formatCompanySize(null)).toBe("unknown"));
  test("undefined returns unknown", () => expect(formatCompanySize(undefined)).toBe("unknown"));
  test("empty string returns unknown", () => expect(formatCompanySize("")).toBe("unknown"));
  test("unrecognized text returns unknown", () => expect(formatCompanySize("lots of people")).toBe("unknown"));

  test("'Myself only' returns 0-1", () => expect(formatCompanySize("Myself only")).toBe("0-1"));
  test("case-insensitive myself only", () => expect(formatCompanySize("MYSELF ONLY")).toBe("0-1"));

  test("simple numeric range", () => expect(formatCompanySize("2-10 employees")).toBe("2-10"));
  test("range with comma-formatted numbers", () => expect(formatCompanySize("1,001-5,000 employees")).toBe("1001-5000"));
  test("range with en dash", () => expect(formatCompanySize("201 – 500 employees")).toBe("201-500"));
  test("large range", () => expect(formatCompanySize("10,001-50,000")).toBe("10001-50000"));

  test("plus notation", () => expect(formatCompanySize("10,001+ employees")).toBe("10001+"));
  test("simple plus", () => expect(formatCompanySize("500+")).toBe("500+"));
  test("lone small number without plus is unknown", () => expect(formatCompanySize("42 employees")).toBe("unknown"));
});

describe("formatCompanySize in other LinkedIn languages", () => {
  test.each([
    ["Czech: space thousands, en dash", "5 001–10 000 zaměstnanců", "5001-10000"],
    ["Danish: dot thousands, spaced dash", "5.001 - 10.000 medarbejdere", "5001-10000"],
    ["German: dot thousands, en dash", "5.001–10.000 Beschäftigte", "5001-10000"],
    ["Greek", "5.001-10.000 εργαζόμενοι", "5001-10000"],
    ["Spanish", "5.001 - 10.000 empleados", "5001-10000"],
    ["Finnish", "5 001-10 000 työntekijää", "5001-10000"],
    ["Ukrainian: spaced en dash", "5 001 – 10 000 працівників", "5001-10000"],
    ["Polish: small range", "2–10 pracowników", "2-10"],
    ["Portuguese: 'a' between numbers", "5.001 a 10.000 funcionários", "5001-10000"],
    ["Japanese: wave dash", "従業員5,001～10,000人", "5001-10000"],
    ["Korean: tilde", "직원 5,001~10,000", "5001-10000"],
    ["Hindi", "5,001-10,000 कर्मचारी", "5001-10000"],
    ["Arabic: bidirectional marks", "‏11‏ - ‏50‏ من الموظفين", "11-50"],
    ["Hebrew: bidirectional marks", "‏5,001‏ - ‏10,000‏ עובדים", "5001-10000"],
    ["Bangla digits", "১১-৫০ জন কর্মী", "11-50"],
    ["Marathi: Devanagari digits", "५,००१ - १०,००० कर्मचारी", "5001-10000"],
    ["Persian digits and separator", "‏۱۰٬۰۰۱‏+ کارمند", "10001+"],
    ["Hungarian: 'more than' in words", "Több mint 10 001 alkalmazott", "10001+"],
    ["Romanian: 'more than' in words", "Peste 10.001 angajați", "10001+"],
    ["Russian: 'more than' in words", "Более 10 001 сотрудника", "10001+"],
    ["Telugu: 'more than' after the number", "10,001 కంటే ఎక్కువ మంది ఉద్యోగులు", "10001+"],
  ])("%s", (_, input, expected) => {
    expect(formatCompanySize(input)).toBe(expected);
  });

  test("members line right after a range is ignored", () => {
    expect(formatCompanySize("5 001-10 000 alkalmazott5 716 társult felhasználó")).toBe("5001-10000");
  });

  test("members line right after an open-ended size is not taken as a range end", () => {
    expect(formatCompanySize("Fler än 10 001 anställda75 045 associerade medlemmar")).toBe("10001+");
  });
});
