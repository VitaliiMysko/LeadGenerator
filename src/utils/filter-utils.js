export function matchesFilter(value, filters) {
  return filters.length === 0 || filters.some((f) => value.toLowerCase().includes(f.toLowerCase()));
}
