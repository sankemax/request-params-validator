import express, { Request, Response } from "express";

export default express.Router()
    .post('/models', modelsHandler)
    .post('/validate', validationHandler);

function modelsHandler(req: Request, res: Response) {

}

function validationHandler(req: Request, res: Response) {

}

export function internalErrorHandler(err: Error, req: Request, res: Response) {
    console.error(err.stack);
    res.json({ success: false, message: 'internal server error' });
}
