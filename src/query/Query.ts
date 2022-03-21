import { get, Writable, writable } from "svelte/store";
import { isPromise } from "../functions/promise";

export type QueryOptions = {
  enabled?: boolean;
  onError?: () => void;
};

export type QueryState<Data> = {
  isSuccess: boolean;
  isLoading: boolean;
  data: Data | undefined;
  refetch: () => void;
};

export type QuerySetDataParam<Data> = Data | ((data: Data) => Data);

export type QueryCallback<Data> = () => Promise<Data> | Data;

export class Query<Data> {
  public store: Writable<QueryState<Data>>;

  constructor(cb: QueryCallback<Data>, options: QueryOptions) {
    const fetchData = () => {
      // Do not refetch if we already have the data
      if (this.getData()) {
        return;
      }
      const response = cb();
      if (isPromise(response)) {
        response.then(this.setData).catch((e: unknown) => {
          options.onError?.();
          this.store.update((v) => ({
            ...v,
            isLoading: false,
            isSuccess: false,
          }));
        });
      } else {
        this.setData(response);
      }
    };

    this.store = writable<QueryState<Data>>({
      isSuccess: false,
      isLoading: false,
      data: undefined,
      refetch: fetchData,
    });

    if (options.enabled !== false) {
      fetchData();
    }
  }

  getState = (): QueryState<Data> => {
    return get(this.store);
  };

  /**
   * Manually update the data for the query
   */
  setData = (newData: QuerySetDataParam<Data>) => {
    this.store.update((v) => ({
      ...v,
      isLoading: false,
      isSuccess: true,
      data:
        typeof newData === "function"
          ? (newData as Function)(v.data!)
          : newData,
    }));
  };

  getData = (): Data | undefined => {
    return this.getState().data;
  };
}
