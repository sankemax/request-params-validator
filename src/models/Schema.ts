import { ID, Method, Obj } from "./types";

export interface Schema extends Obj {
    path: string
    method: Method
}

export interface SchemaWId extends Schema {
    id: ID
}
