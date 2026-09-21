import { validatePackageContents, PACKAGE_ENTRIES } from "../scripts/chrome-web-store/package-extension.js";

describe("PACKAGE_ENTRIES", () => {
  test("only lists the extension's actual runtime files", () => {
    expect(PACKAGE_ENTRIES).toEqual(["manifest.json", "index.html", "assets", "libs", "src"]);
  });
});

describe("validatePackageContents", () => {
  test("passes for a well-formed package", () => {
    expect(validatePackageContents(["manifest.json", "index.html", "assets", "libs", "src"])).toEqual([]);
  });

  test("fails when manifest.json is missing", () => {
    const errors = validatePackageContents(["index.html", "src"]);
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining("manifest.json")]));
  });

  test("fails when a development-only directory leaked into the package", () => {
    const errors = validatePackageContents(["manifest.json", "tests", "node_modules"]);
    expect(errors).toEqual(
      expect.arrayContaining([expect.stringContaining("tests"), expect.stringContaining("node_modules")])
    );
  });
});
