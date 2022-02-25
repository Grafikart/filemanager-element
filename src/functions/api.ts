import { flash } from "../store";
import { HTTPStatus } from "../types";
import type { ApiOptions, ApiPaths, ApiResponse } from "src/types/openapi";
import { objToQueryParams } from "./url";

export function fetchApi<
  Path extends ApiPaths,
  Options extends ApiOptions<Path>
>(baseUrl: string, path: Path, options: Options) {
  const o = { ...options };
  let url = baseUrl + path;
  o.credentials = "include";
  o.headers = { ...o.headers };
  o.headers["Accept"] = "application/json";
  if (o.json) {
    o.body = JSON.stringify(o.json);
    o.headers["Content-Type"] = "application/json";
  }
  // Add query parameters into the URL
  if (o.query) {
    url += `?${objToQueryParams(o.query).toString()}`;
  }
  // Replace params in the URL ("/path/{id}" for instance)
  if (o.params) {
    Object.keys(o.params).forEach(
      (k) => (url = url.replace(`{${k}}`, o.params[k]))
    );
  }
  return fetch(url, o).then((r) => {
    if (r.status === HTTPStatus.NoContent) {
      return null;
    }
    if (r.status >= HTTPStatus.OK && r.status < HTTPStatus.MultipleChoices) {
      return r.json() as Promise<ApiResponse<Path, typeof options.method>>;
    }
    if (r.status === HTTPStatus.UnprocessableEntity) {
      const data = r.json().then((data) => {
        if (data?.message) {
          flash(data.message, "danger");
        }
      });
    }
    throw r;
  });
}
