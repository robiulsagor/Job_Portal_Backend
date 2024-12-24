import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update-profile", isAuth, updateProfile);

export default router;
