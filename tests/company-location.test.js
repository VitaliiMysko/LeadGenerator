import { extractCountry } from "../src/scripts/containers/filters/company-location.js";

describe("extractCountry", () => {
  test("returns empty string for null", () => {
    expect(extractCountry(null)).toBe("");
  });
  test("returns empty string for empty string", () => {
    expect(extractCountry("")).toBe("");
  });
  test("extracts country from 'City, Country'", () => {
    expect(extractCountry("Warsaw, Poland")).toBe("Poland");
  });
  test("extracts country from 'City, Region, Country'", () => {
    expect(extractCountry("Munich, Bavaria, Germany")).toBe("Germany");
  });
  test("extracts multi-word country name", () => {
    expect(extractCountry("London, United Kingdom")).toBe("United Kingdom");
  });
  test("location that is just a country name", () => {
    expect(extractCountry("France")).toBe("France");
  });
  test("returns empty for non-European country", () => {
    expect(extractCountry("New York, United States")).toBe("");
  });
  test("falls back to substring match when last segment is not a country", () => {
    expect(extractCountry("Berlin, Germany, District")).toBe("Germany");
  });
  test("multi-word country with comma-separated location", () => {
    expect(extractCountry("Sarajevo, Bosnia and Herzegovina")).toBe("Bosnia and Herzegovina");
  });
});
