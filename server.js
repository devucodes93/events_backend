import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import user from "./router/User.js";
dotenv.config();

const app = express();
const port =3000;

connectDb();
app.use(express.json());

app.use("/api/auth",user)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})