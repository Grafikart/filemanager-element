import {
  Query,
  QueryCallback,
  QueryOptions,
  QuerySetDataParam,
  QueryState,
} from "./Query";

export class QueryClient {
  private queries = new Map() as Map<string, Query<any>>;

  public getQuery<Data>(
    key: string,
    cb: QueryCallback<Data>,
    options = {} as QueryOptions
  ): Query<Data> {
    if (!this.queries.has(key)) {
      this.queries.set(key, new Query(cb, options));
    }
    return this.queries.get(key) as Query<Data>;
  }

  public setQueryData<Data>(key: string, updater: QuerySetDataParam<Data>) {
    const query = this.queries.get(key);
    if (query) {
      query.setData(updater);
    }
  }

  public getQueryData<Data>(key: string): Data | undefined {
    return this.queries.get(key)?.getData();
  }

  public getQueryState(key: string): QueryState<unknown> {
    const query = this.queries.get(key);
    if (query) {
      return query.getState();
    }
    return {
      data: undefined,
      isLoading: false,
      isSuccess: false,
      refetch: () => {},
    };
  }
}
