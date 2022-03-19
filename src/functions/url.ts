export function objToQueryParams<O extends Record<string, string>>(
  o: O,
  p?: URLSearchParams
) {
  const params = p || new URLSearchParams();
  Object.keys(o)
    .filter((k: keyof O) => o[k] !== undefined)
    .forEach((k: string) => params.set(k, o[k]!));
  return params;
}
