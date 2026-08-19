window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.constantsInit) {
  window.leadGenerator.constants = window.leadGenerator.constants || {};
  (() => {
    const companyStatus = [
      "inc",
      "ind",
      "corp",
      "ltd",
      "AB",
      "AS",
      "A/S",
      "ASA",
      "LP",
      "Plc",
      "S.L",
      "AG",
      "S.A",
      "S.p.A",
      "Aps",
      "LLC",
      "LLP",
      "PLC",
      "GmbH",
      "s.r.o",
      "spol",
      "SA",
      "B.V.",
      "N.L.",
      "Oy",
      "Oyj",
      "Ky",
    ];

    const dutchSurnames = ["van", "der", "den", "de"];

    window.leadGenerator.constants.companyStatus = companyStatus;
    window.leadGenerator.constants.dutchSurnames = dutchSurnames;
  })();

  window.leadGenerator.constantsInit = true;
}
