import { getContext } from "svelte";
import type { QueryClient as QueryClientType } from "./QueryClient";

/**
 * This is a partial implementation of react-query for svelte with a limited set of feature
 */
export const contextKey = Symbol("queryClient");
export { QueryClient } from "./QueryClient";
export { useQuery } from "./useQuery";
export { useMutation } from "./useMutation";
export function useQueryClient(): QueryClientType {
  return getContext(contextKey);
}
export { default as QueryClientProvider } from "./QueryClientProvider.svelte";
