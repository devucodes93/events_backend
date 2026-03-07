import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import pool from "../config/db.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.file) {
      return res.status(400).json({
        msg: "All fields Required",
        success: false,
      });
    }

    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExist.rows.length > 0) {
      return res.status(400).json({
        msg: "User Already Exist",
        success: false,
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(name, email, password, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashPass, req.file.path],
    );

    res.status(201).json({
      msg: "User Created Successfully",
      success: true,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "All fields Required", success: false });
    }
    const userExist = await pool.query("select * from users where email = $1", [
      email,
    ]);
    if (!userExist.rows.length) {
      return res
        .status(400)
        .json({ msg: "Invalid Crendentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, userExist.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }
    console.log(userExist.rows[0].id);
    const token = jwt.sign(
      { id: userExist.rows[0].id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    return res.status(201).json({
      msg: "Login Successful",
      user: {
        id: userExist.rows[0].id,
        name: userExist.rows[0].name,
        email: userExist.rows[0].email,
        profilePic: userExist.rows[0].profile_pic,
      },
      success: true,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "SELECT id, name, email, profile_pic FROM users WHERE id = $1",
      [id],
    );
    if (!user.rows.length) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      user: user.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.params.id;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    const updatedUser = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), profile_pic = COALESCE($2, profile_pic) WHERE id = $3 RETURNING id, name, email, profile_pic",
      [updateData.name, updateData.profilePic, userId],
    );

    res.status(200).json({
      msg: "Profile updated",
      success: true,
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};
