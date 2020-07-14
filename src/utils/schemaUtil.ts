import { Method } from "../models/types";
import { Schema } from "../models/Schema";

export function getId(path: string, method: Method) {
    if (path == null && method == null) {
        throw new Error('request doesn\'t contain path or method or both');
    }
    return `${path}${method}`; // TODO: some simple hashing needed
}

export function generateIdBySchema(schema: Schema) {
    return getId(schema.path, schema.method);
}

