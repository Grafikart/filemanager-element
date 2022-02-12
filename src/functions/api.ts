import { flash } from '../store'
import { HTTPStatus } from '../types'
import type { ApiOptions, ApiPaths, ApiResponse } from "src/types/openapi";
import { objToQueryParams } from "./url";

/**
 * Utility types
// Filtre un objet en retirant les clefs qui ne satisfont pas la condition C
type Filter<T, C> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends C ? Key : never;
  }[keyof T]
>;
// Trouve les valeurs qui sont dans tous les ensembles T
type KeysOfUnion<T> = T extends T ? keyof T : never;
// Trouve le type d'une valeur en profondeur dans un object Get<obj, ["player", "firstname"]>
type Get<T extends any, K extends any[], D = never> = K extends []
  ? T
  : K extends [infer A, ...infer B]
  ? A extends keyof T
    ? Get<T[A], B>
    : D
  : D;
// Extrait la liste des clefs requises
type RequiredKeys<T> = {
  [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
}[keyof T];
// Vérifie si toutes les sous clef sont requise dans T, renvoie never si ce n'est pas le cas
type AllRequiredKey<T> = {
  [K in keyof T]: RequiredKeys<T[K]> extends never ? K : never;
}[keyof T];
// Rend certaines clefs optionnelles
type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
// Rend les clefs, qui n'ont que des valeurs optionnelles, optionnelles
type OptionalDeep<T> = Optional<T, AllRequiredKey<T>>;
// Retire les valeur "never" des clefs d'un objet
type PickDefined<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
>;

/*
 * API Related types
export type Paths = keyof paths;
type PathMethods<Path extends Paths> = keyof paths[Path];
type HTTPSuccess = 200 | 201 | 204;
export type Methods = KeysOfUnion<paths[keyof paths]>;
export type ApiResponse<Path, Method, Type = "application/json"> = Get<
  paths,
  [Path, Method, "responses", HTTPSuccess, "content", Type]
>;
type ApiParam<Path, Method, Parameter> = Get<
  paths,
  [Path, Method, "parameters", Parameter]
>;
type ApiRequestBody<Path, Method, Type = "application/json"> = Get<
  paths,
  [Path, Method, "requestBody", "content", Type]
>;
export type FetchOptions<Path, Method> = RequestInit & {
  method?: Method;
  headers?: Record<string, string>;
} & OptionalDeep<
    PickDefined<{
      query: Record<string, unknown>;
      params: ApiParam<Path, Method, "path">;
      json: ApiRequestBody<Path, Method, "application/json">;
    }>
  >;

export function fetchApi<Path extends Paths, Method extends Methods = "get">(
  baseUrl: string,
  path: Path,
  options?: FetchOptions<Path, Method>
): Promise<ApiResponse<Path, Method>> {
  const o = {
    headers: {},
    credentials: "include",
    ...options,
  } as RequestInit & {
    json?: object;
    headers: Record<string, string>;
    query?: Record<string, any>;
    params?: Record<string, any>;
  };
  const query = o.query;
  const params = o.params;
  let url = baseUrl + path;
  o.headers["Accept"] = "application/json";
  // Si on a une clef json, alors la requête aura un body json
  if (o.json) {
    o.body = JSON.stringify(o.json);
    o.headers["Content-Type"] = "application/json";
  }
  // On ajoute les query parameters à l'URL
  if (query) {
    const params = new URLSearchParams();
    Object.keys(query).forEach((k: string) => {
      if (query[k] !== undefined) {
        params.set(k, query[k]);
      }
    });
    url += `?${params.toString()}`;
  }
  // On remplace les paramètres dans l'url ("/path/{id}" par exemple)
  if (params) {
    Object.keys(params).forEach(
      (k) => (url = url.replace(`{${k}}`, params[k]))
    );
  }
  return fetch(url, o).then((r) => {
    if (r.status === HTTPStatus.NoContent) {
      return null;
    }
    if (r.status >= HTTPStatus.OK && r.status < HTTPStatus.MultipleChoices) {
      return r.json();
    }
    if (r.status === HTTPStatus.UnprocessableEntity) {
      const data = r.json().then(data => {
        if (data?.message) {
          flash(data.message, 'danger')
        }
      })
    }
    throw r;
  });
}

*/

export function fetchApi<Path extends ApiPaths, Options extends ApiOptions<Path>>(
  baseUrl: string,
  path: Path,
  options: Options
): Promise<ApiResponse<Path, Options['method']>> {
  const o = { ...options }
  let url = baseUrl + path;
  o.credentials = 'include'
  o.headers['Accept'] = 'application/json'
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
  return fetch(url, o)
    .then((r) => {
      if (r.status === HTTPStatus.NoContent) {
        return null;
      }
      if (r.status >= HTTPStatus.OK && r.status < HTTPStatus.MultipleChoices) {
        return r.json();
      }
      if (r.status === HTTPStatus.UnprocessableEntity) {
        const data = r.json().then(data => {
          if (data?.message) {
            flash(data.message, 'danger')
          }
        })
      }
      throw r;
    })
}