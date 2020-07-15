import { Method } from "../models/types";
import { Schema } from "../models/Schema";

export function getId(path: string, method: Method) {
    return `${path}${method}`; // simple hashing
}

export function generateIdBySchema(schema: Schema) {
    const { path, method } = schema;

    if (path == null && method == null) {
        throw new Error('request doesn\'t contain path or method or both');
    }
    
    return getId(schema.path, schema.method);
}

