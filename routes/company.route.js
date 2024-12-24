import express from "express";
import isAuth from "../middleware/auth.middleware.js";
import {
  getCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();

router.post("/register", isAuth, registerCompany);
router.get("/get", isAuth, getCompanies);
router.get("/get/:companyId", isAuth, getCompanyById);
router.put("/update/:companyId", isAuth, updateCompany);

export default router;
