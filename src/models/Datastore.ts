import { ID } from "./types";
import { Schema } from "./Schema";

export interface Datastore {
    insert(schema: Schema): Promise<ID>
    load(id: ID): Promise<Schema>
    delete(id: ID): Promise<Schema>
}
