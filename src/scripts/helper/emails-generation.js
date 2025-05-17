export const emailTemplates = [
  {
    template: "{first}.{last}@{host}",
    condition: ({ first, last }) => first && last.length > 1,
  },
  {
    template: "{initialFirst}{last}@{host}",
    condition: ({ last }) => last.length > 1 && !last.includes("."),
  },
  {
    template: "{initialFirst}.{last}@{host}",
    condition: ({ last }) => last.length > 1 && !last.includes("."),
  },
  {
    template: "{first}@{host}",
    condition: ({ first }) => first,
  },
  {
    template: "{initials}@{host}",
    condition: ({ initials }) => initials.length >= 2 && !initials !== "",
  },
  {
    template: "{last}@{host}",
    condition: ({ last }) => last.length > 1 && !last.includes("."),
  },
  {
    template: "{first}{last}@{host}",
    condition: ({ first, last }) =>
      !first.includes("-") &&
      last.length > 1 &&
      !last.includes(".") &&
      !last.includes("-"),
  },
  {
    template: "{first}.{lastPart2}@{host}",
    condition: ({ lastPart1, lastPart2 }) =>
      lastPart2 !== "" && lastPart1 === "",
  },
  {
    template: "{initialFirst}.{lastPart2}@{host}",
    condition: ({ lastPart1, lastPart2 }) =>
      lastPart2 !== "" && lastPart1 === "",
  },
  {
    template: "{initialFirst}{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
  },
  {
    template: "{first}{lastPart2}@{host}",
    condition: ({ first, lastPart1, lastPart2 }) =>
      lastPart2 !== "" && !first.includes("-") && lastPart1 === "",
  },
  {
    template: "{first}.{lastPart2}@{host}",
    condition: ({ lastPart1, lastPart2 }) =>
      lastPart2 !== "" && lastPart1 === "",
  },
  {
    template: "{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
  },
  {
    template: "{firstNoHyphen}.{last}@{host}",
    condition: ({ firstNoHyphen, last }) =>
      firstNoHyphen && last.length > 1 && !last.includes("."),
  },
  {
    template: "{firstNoHyphen}.{lastPart2}@{host}",
    condition: ({ firstNoHyphen, lastPart2 }) => firstNoHyphen && lastPart2,
  },
  {
    template: "{first}_{last}@{host}",
    condition: ({ first, last }) =>
      first.length > 1 &&
      !first.includes("-") &&
      last.length > 1 &&
      !last.includes("."),
  },
  {
    template: "{first}_{lastPart2}@{host}",
    condition: ({ first, lastPart1, lastPart2 }) =>
      !first.includes("-") && lastPart2 !== "" && lastPart1 === "",
  },
];
