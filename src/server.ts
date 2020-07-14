import express from "express";
import Router, { internalErrorHandler } from "./routes/Router";

const port = process.env.PORT || 3000; 

express()
    .use('/api', Router)
    .use(internalErrorHandler)
    .listen(port, () => console.log(`listening on port ${port}`));


