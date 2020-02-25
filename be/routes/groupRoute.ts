import express from 'express';
import { Express } from 'express';

const groupRoute = (app: Express, path) => {
    const router = express.Router()
    app.use(path, router);
    return router;
}


export default groupRoute;