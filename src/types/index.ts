import type { components } from "./generated-schema";

export type Folder = {
  children?: components["schemas"]["Folder"][];
  id: components["schemas"]["ID"] | null;
  name: string;
  parent: components["schemas"]["ID"] | null;
};
export type File = components["schemas"]["File"];
export type FlashMessage = {
  type: "success" | "danger";
  message: string;
  id: number;
};
export type ID = string | number;
export type Props = { [key: string]: any };

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

/**
 * Utility types
 */
export type TupleToUnion<T extends any[]> = T[number];
export type ShiftFunctionParameter<T> = T extends (
  args: any,
  ...args2: infer P
) => infer R
  ? (...args: P) => R
  : never;
export type ShiftAllFunctionsParameter<T extends object> = {
  [key in keyof T]: ShiftFunctionParameter<T[key]>;
};
