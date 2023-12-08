// src/app.ts
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import {getReservedSlots, reserve, getReservedSlotsByUser} from './reserve';
import validateRequestBody from './utils/validator';
import cors from 'cors';

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

// TODO add validation
app.get('/reservedSlots/:userId', getReservedSlotsByUser);

app.get('/fullReservedSlots', getReservedSlots);

app.post('/reserve', validateRequestBody, reserve);

export default app;