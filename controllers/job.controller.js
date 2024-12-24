import jobModel from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      companyId,
      userId,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experienceLevel ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const newJob = await jobModel({
      title,
      description,
      requirements: requirements.split(",").map((req) => req.trim()),
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company: companyId,
      createdBy: userId,
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully!",
      job: newJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await jobModel
      .find(query)
      .populate("company", "name")
      .populate("createdBy", "fullname")
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: "Jobs not found!",
      });
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await jobModel
      .findById(req.params.id)
      .populate("company", "name");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found!",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const getAllJobsByAdmin = async (req, res) => {
  try {
    const jobs = await jobModel
      .find({ createdBy: req.body.userId })
      .populate("company", "name");
    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: "No jobs found!",
      });
    }

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};
