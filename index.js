import express from "express";
import dotenv from "dotenv";

import { aiChat } from "./chatController.js";
import connectDB from "./database/db.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded());
connectDB();
app.post("/chat", aiChat);

app.listen(3000, () => {
  console.log("server is listening at 3000 port");
});
