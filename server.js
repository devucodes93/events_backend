import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import user from "./router/User.js";
import product from "./router/Product.js";
import cart from "./router/Cart.js";
dotenv.config();

const app = express();
const port =3000;

connectDb();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "hi" });
});

app.use("/api/auth",user)
app.use("/api/product",product)
app.use("/api/cart",cart)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})