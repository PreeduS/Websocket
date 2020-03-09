import { Express } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import setupMongoose from './app/mongoose/setupMongoose';
import setupPassport from './app/auth/localStrategy/localStrategy';
import setupRoutes from './routes/';

const setupMiddleware = (app: Express) => {
    app.use('/',bodyParser.json());
    app.use('/',cors());
}

export default (app: Express) => {
    setupMiddleware(app);
    setupMongoose();
    setupRoutes(app);
    setupPassport();



}