import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import user from "./router/User.js";

const app = express();
const port = 3000;

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", user);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
