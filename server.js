import express from "express";

import dotenv from "dotenv";
dotenv.config();
import user from "./router/User.js";
import eventRouter from "./router/EventRoute.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", user);
app.use("/api/events", eventRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
