import express from 'express';
import cors from 'cors';
import routes from './infrastructure/http/routes';

export const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(routes);