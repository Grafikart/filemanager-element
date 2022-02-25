export function shorten (str: string, max: number) {
  if (str.length <= max) {
    return str;
  }
  return str.slice(0, max - 11) + '...' + str.slice(-8);
}
