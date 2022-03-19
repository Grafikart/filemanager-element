import { flash } from "../store";
import { HTTPStatus } from "../types";
import type { ApiOptions, ApiPaths, ApiResponse } from "src/types/openapi";
import { objToQueryParams } from "./url";

export function fetchApi<
  Path extends ApiPaths,
  Options extends ApiOptions<Path>
>(baseUrl: string, path: Path, options: Options) {
  const o = { ...options };
  let url = new URL(
    (baseUrl.startsWith("/") ? window.location.origin : "") + baseUrl
  );
  url.pathname = url.pathname + path;
  o.credentials = "include";
  o.headers = { ...o.headers };
  o.headers["Accept"] = "application/json";
  if (o.json) {
    o.body = JSON.stringify(o.json);
    o.headers["Content-Type"] = "application/json";
  }
  // Add query parameters into the URL
  if (o.query) {
    objToQueryParams(o.query, url.searchParams);
  }
  // Replace params in the URL ("/path/{id}" for instance)
  if (o.params) {
    Object.keys(o.params).forEach(
      (k) => (url.pathname = url.pathname.replace(`%7B${k}%7D`, o.params[k]))
    );
  }
  return fetch(url.toString(), o).then((r) => {
    if (r.status === HTTPStatus.NoContent) {
      return null;
    }
    if (r.status >= HTTPStatus.OK && r.status < HTTPStatus.MultipleChoices) {
      return r.json() as Promise<ApiResponse<Path, typeof options.method>>;
    }
    if (r.status === HTTPStatus.UnprocessableEntity) {
      r.json().then((data) => {
        if (data?.message) {
          flash(data.message, "danger");
        }
      });
    }
    throw r;
  });
}
