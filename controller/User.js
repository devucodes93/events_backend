import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.file) {
      return res.status(400).json({
        msg: "All fields Required",
        success: false,
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        msg: "User Already Exist",
        success: false,
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPass,
      profilePic: req.file.path,
    });

    res.status(201).json({
      msg: "User Created Successfully",
      success: true,
      user: { id: newUser._id },
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
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "All fields Required", success: false });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ msg: "Invalid Crendentials", success: false });
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).json({
      msg: "User Created Successfully",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
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
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      user,
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

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({
      msg: "Profile updated",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};
