import { Route } from '@yellow-snow/core';
import { HttpRoute } from '@yellow-snow/http';

// controllers

import { PingController } from './controllers/ping.controller';

// routes

export const routes: Route<any>[] = [
    new HttpRoute("/ping","all",PingController,"ping")
];