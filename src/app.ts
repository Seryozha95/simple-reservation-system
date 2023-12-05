// src/app.ts
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import reserve from './reserve';
import validateRequestBody from './utils/validator';

const app: Application = express();

app.use(bodyParser.json());

app.post('/reserve', validateRequestBody, reserve);

export default app;