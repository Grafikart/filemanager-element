import type { paths as ApiSchema } from "./generated-schema";
import type { Optional, RequiredKeys, ValuesType } from "utility-types";

/**
 * Utilities
 */
// Find a property in another type Get<obj, ["player", "firstname"]>
type Get<T extends any, K extends any[], D = never> = K extends []
  ? T
  : K extends [infer A, ...infer B]
  ? A extends keyof T
    ? Get<T[A], B>
    : D
  : D;
// Extract keys
type KeysWithOnlyOptionals<T extends object> = {
  [K in keyof T]: RequiredKeys<T[K]> extends never ? K : never;
}[keyof T];
// Make the key that only have optionals, optional themself
type OptionalDeep<T extends object> = Optional<T, KeysWithOnlyOptionals<T>>;

export enum HTTPStatus {
  OK = 200,
  Created = 201,
  MultipleChoices = 300,
  NoContent = 204,
  UnprocessableEntity = 422,
  Forbidden = 403,
  NotFound = 404,
  BadRequest = 400,
}
type HTTPSuccess = 200 | 201 | 204;
export type ApiPaths = keyof ApiSchema;
export type ApiOptions<Path extends ApiPaths> = ValuesType<{
  [Method in keyof ApiSchema[Path]]: RequestInit &
    OptionalDeep<
      Optional<
        {
          method: Method;
          query: Get<ApiSchema[Path][Method], ["parameters", "query"]>;
          params: Get<ApiSchema[Path][Method], ["parameters", "path"]>;
          json: Get<
            ApiSchema[Path][Method],
            ["requestBody", "content", "application/json"]
          >;
        },
        Method extends "get" ? "method" : never
      >
    >;
}>;
export type ApiResponse<Path, Method, Type = "application/json"> = Get<
  ApiSchema,
  [Path, Method, "responses", HTTPSuccess, "content", Type]
>;
