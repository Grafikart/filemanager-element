import { getContext } from "svelte";
import type { Options } from "../types";

export * from "./files";
export * from "./flash";
export { uploads } from "./uploads";
export function getOptions(): Options {
  return getContext("options");
}
