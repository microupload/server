import * as functions from 'firebase-functions';
import * as express from "express";
import * as cors from "cors";
import { HttpRouter } from '@yellow-snow/http/lib';
import { routes } from './routes';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const http = express();
http.use(cors());

new HttpRouter(routes).init(http);

export const api = functions.https.onRequest(http);
