function isAsciiSpace(code) {
  return code === 32 || code === 9 || code === 10 || code === 13;
}

export function trimAsciiWhitespace(str) {
  let start = 0;
  let end = str.length;
  while (start < end && isAsciiSpace(str.charCodeAt(start))) start++;
  while (end > start && isAsciiSpace(str.charCodeAt(end - 1))) end--;

  return str.slice(start, end);
}
