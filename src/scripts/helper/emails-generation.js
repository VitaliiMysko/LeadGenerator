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
    condition: ({ last }) =>
      last.length > 1 && !last.includes(".") && !last.includes("-"),
  },
  {
    template: "{first}.{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
  },
  {
    template: "{initialFirst}.{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
  },
  {
    template: "{initialFirst}{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
  },
  {
    template: "{first}{lastPart2}@{host}",
    condition: ({ first, lastPart2 }) =>
      lastPart2 !== "" && !first.includes("-"),
  },
  {
    template: "{first}.{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
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
      first && last.length > 1 && !last.includes("."),
  },
  {
    template: "{first}{lastPart1}{lastPart2}@{host}",
    condition: ({ first, lastPart1, lastPart2 }) =>
      first && !lastPart1.includes("-") && !lastPart2.includes("-"),
  },
  {
    template: "{first}{lastPart1}@{host}",
    condition: ({ first, lastPart1 }) => first && !lastPart1.includes("-"),
  },
  {
    template: "{first}.{lastPart1}@{host}",
    condition: ({ first, lastPart1 }) => first && !lastPart1.includes("-"),
  },
  {
    template: "{initialFirst}{lastPart1}@{host}",
    condition: ({ lastPart1 }) => !lastPart1.includes("-"),
  },
  {
    template: "{first}_{lastPart2}@{host}",
    condition: ({ lastPart2 }) => lastPart2 !== "",
  },
  {
    template: "{initialFirst}.{initialLastPart1}.{lastPart2}@{host}",
    condition: ({ initialLastPart1, lastPart2 }) =>
      initialLastPart1 !== "" && lastPart2 !== "",
  },
];
