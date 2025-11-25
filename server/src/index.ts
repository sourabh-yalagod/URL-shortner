import express from "express";
import cors from "cors"
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors({ origin: [process.env.CLIENT_URL as string] }));

app.use(express.json());
const PORT = process.env.PORT || 3000;

import routers from "./routes/url.routes"
import { createTable } from "./db";

app.use("/", routers)

app.listen(PORT, () => {
  createTable();
  console.log(`Server running on http://localhost:${PORT}`);
});