import companyModel from "../models/company.model";

export const registerCompany = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Company name is required" });
    }

    const company = await companyModel.findOne({ name });
    if (company) {
      return res
        .status(400)
        .json({ success: false, message: "Company already exists" });
    }
    const newCompany = new companyModel({
      name,
      userId,
    });

    await newCompany.save();

    res.status(201).json({
      success: true,
      message: "Company created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { userId } = req.body;
    const companies = await companyModel.find({ userId });

    if (!companies) {
      return res.status(404).json({
        success: false,
        message: "Companies not found",
      });
    }

    res.json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await companyModel.findById({ companyId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};
