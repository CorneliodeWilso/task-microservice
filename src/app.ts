import express from "express";
import cors from "cors";
import routes from "./infrastructure/http/routes";
import dotenv from "dotenv";
dotenv.config();
export const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(routes);