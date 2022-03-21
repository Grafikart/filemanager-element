import type { QueryCallback, QueryOptions } from "./Query";
import { useQueryClient } from "./index";

export function useQuery<Data>(
  key: string,
  cb: QueryCallback<Data>,
  options: QueryOptions = {}
) {
  const query = useQueryClient().getQuery(key, cb, options);
  return {
    subscribe: query.store.subscribe,
  };
}
