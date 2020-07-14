import { generateIdBySchema } from "../utils/schemaUtil";

import { Datastore } from "../models/Datastore";
import { Schema } from "../models/Schema";
import { ID } from "../models/types";

class MapDatastore implements Datastore {
    store = new Map();

    async insert(schema: Schema): Promise<ID> {
        const id = generateIdBySchema(schema);
        this.store.set(id, schema);
        return id;
    }

    async load(id: ID): Promise<Schema> {
        if (!this.store.has(id)) {
            throw new Error('schema does not exist');
        }

        return this.store.get(id);
    }

    async delete(id: ID): Promise<Schema> {
        throw new Error('method not implemented');
    }
}

export default new MapDatastore();
