import type { components } from "./generated-schema";
import type FR from "../langs/fr";
import type config from "../config";

export type Folder = components["schemas"]["Folder"] & {
  children?: Folder[];
};
export type NullableId = components["schemas"]["NullableID"];
export type Lang = typeof FR;
export type File = components["schemas"]["File"];
export type FlashMessage = {
  type: "success" | "danger";
  message: string;
  id: number;
};

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

export type Options = typeof config;
