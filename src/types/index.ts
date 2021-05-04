import { components, paths } from "./generated-schema";

export type Folder = components["schemas"]["Folder"];
export type File = components["schemas"]["File"];
export type ID = string | number;
export type Props = { [key: string]: any };

export enum HTTPStatus {
    OK = 200,
    Created = 201,
    NoContent = 204,
    UnprocessableEntity = 422,
    Forbidden = 403,
    NotFound = 404,
    BadRequest = 400,
}
