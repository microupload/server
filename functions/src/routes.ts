import { Route } from '@yellow-snow/core';
import { HttpRoute } from '@yellow-snow/http';
import * as multer from "multer";

const upload = multer();

// controllers

import { PingController } from './controllers/ping.controller';
import { FileController } from './controllers/file.controller';

// routes

export const routes: Route<any>[] = [
    new HttpRoute("/ping","all",PingController,"ping"),
    new HttpRoute("/upload","post",FileController,"upload")
];