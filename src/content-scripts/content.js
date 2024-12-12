window.leadGenerator = window.leadGenerator || {};

if (!window.leadGenerator.contentInit) {
  window.leadGenerator.content = window.leadGenerator.content || {};
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
    ];

    const dutchSurnames = ["van", "der", "den", "de"];

    window.leadGenerator.content.companyStatus = companyStatus;
    window.leadGenerator.content.dutchSurnames = dutchSurnames;
  })();

  window.leadGenerator.contentInit = true;
}
