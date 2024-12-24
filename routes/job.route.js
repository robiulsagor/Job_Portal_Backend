import express from "express";
const router = express.Router();

import isAuth from "../middleware/auth.middleware.js";
import {
  getAllJobsByAdmin,
  createJob,
  getJobById,
  getJobs,
} from "../controllers/job.controller.js";

router.post("/create", isAuth, createJob);
router.get("/get", isAuth, getJobs);
router.get("/get/:id", isAuth, getJobById);
router.get("/getAdminJobs", isAuth, getAllJobsByAdmin);

export default router;
