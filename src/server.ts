import express from "express";
import ValidationRouter, { internalErrorHandler } from "./routes/Router";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000; 

express()
    .use(bodyParser.json())
    .use('/api', ValidationRouter)
    .use(internalErrorHandler)
    .listen(port, () => console.log(`listening on port ${port}`));
