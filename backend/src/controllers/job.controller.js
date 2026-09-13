import jobModel from "../models/job.model.js";

// ======================================================
// CREATE JOB
// ======================================================

export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, deadline, applicationType, applicationLink, status } = req.body;

    const newJob = await jobModel.create({ title, company, location, description, requirements, deadline, applicationType, applicationLink, status });

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job: newJob
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating job.",
      error: error.message
    });
  }
};

// ======================================================
// GET ALL JOBS
// ======================================================

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobCount: jobs.length,
      jobs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching jobs.",
      error: error.message
    });
  }
};

// ======================================================
// GET OPEN JOBS
// ======================================================

export const getOpenJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find({ status: "open" }).sort({ deadline: 1 });

    return res.status(200).json({
      success: true,
      jobCount: jobs.length,
      jobs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching open jobs.",
      error: error.message
    });
  }
};

// ======================================================
// GET ONE JOB
// ======================================================

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await jobModel.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching job.",
      error: error.message
    });
  }
};

// ======================================================
// UPDATE JOB
// ======================================================

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJob = await jobModel.findById(id);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job does not exist."
      });
    }

    const allowedFields = ["title", "company", "location", "description", "requirements", "deadline", "applicationType", "applicationLink", "status"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (Object.hasOwn(req.body, field)) {
        updateData[field] = req.body[field];
      }
    });

    const job = await jobModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating job.",
      error: error.message
    });
  }
};

// ======================================================
// DELETE JOB
// ======================================================

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await jobModel.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job does not exist."
      });
    }

    await jobModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
      jobDeleted: job.title
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting job.",
      error: error.message
    });
  }
};