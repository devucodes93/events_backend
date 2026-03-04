import express from "express";
import { getUser, login, register } from "../controller/User.js";
import upload from "../middleware/upload.js";
const user = express.Router();

user.post("/", upload.single("profilePic"),register);
user.post("/login",login);
user.get("/user/:id", getUser);

export default user;