import express, { Request, Response, NextFunction } from "express";

import mapStore from "../store/MapDatastore";
import { Schema } from "../models/Schema";
import { ID, Obj } from "../models/types";
import { validateObject } from "../validation/validate";
import { Datastore } from "../models/Datastore";

export default express.Router()
    .post('/models', modelsHandler)
    .post('/validate', validationHandler);

async function modelsHandler(req: Request, res: Response) {
    try {
        const schemas: Schema[] | Schema = req.body.data;
        const ids: ID[] = [];
        if (Array.isArray(schemas)) {
            for await (const schema of schemas) {
                ids.push(await mapStore.insert(schema));
            }
        } else {
            ids.push(await mapStore.insert(schemas));
        }

        res.json({
            success: true,
            ids,
        })

    } catch (error) {
        res.json({
            success: false,
            validationResponse: [error.message]
        })
    }
}

async function validationHandler(req: Request, res: Response) {
    try {
        const objects: Obj[] | Obj = req.body.data;
        res.json({
            success: true,
            validationResponse: await validateObjects(objects, mapStore),
        })
    } catch (error) {
        res.json({
            success: false,
            validationResponse: [error.message]
        })
    }
}

export async function validateObjects(objects: Obj[] | Obj, store: Datastore) {
    const validateObjectWithDependencies = validateObject(store);
    const response: any = [];

    if (Array.isArray(objects)) {
        for await (const object of objects) {
            const validationResponse = await validateObjectWithDependencies(object);
            response.push(validationResponse);
        }
    } else {
        const validationResponse = await validateObjectWithDependencies(objects);
        response.push(validationResponse);
    }
    return response;
}

export function internalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.json({ success: false, message: 'internal server error' });
}
