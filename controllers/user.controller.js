import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await user.save();

    res.json({
      success: true,
      message: "User Created Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (role !== user.role) {
      return res.status(401).json({
        success: false,
        message: "Account doesn't exist with current role.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "User logged in successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 }).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, userId } = req.body;

    let skillsArr;
    if (skills) {
      skillsArr = skills.split(",");
    }

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArr;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};
