// Detect if the parameter is a Promise
export function isPromise(target: unknown): target is Promise<unknown> {
  if (
    typeof target === "object" &&
    typeof (target as any)["then"] === "function"
  ) {
    return true;
  }
  return false;
}
