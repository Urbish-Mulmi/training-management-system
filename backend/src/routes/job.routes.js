import express from "express";
import { createJob, getAllJobs, getOpenJobs, getJob, updateJob, deleteJob } from "../controllers/job.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const jobRoutes = express.Router();

// Create job - Admin
jobRoutes.route("/add-job").post(verifyToken, isAdmin, createJob);
// Get all jobs - Admin
jobRoutes.route("/get-all-jobs").get(verifyToken, isAdmin, getAllJobs);
// Update job - Admin
jobRoutes.route("/:id/edit-job").patch(verifyToken, isAdmin, updateJob);
// Delete job - Admin
jobRoutes.route("/:id/delete-job").delete(verifyToken, isAdmin, deleteJob);

// Get open jobs - Public
jobRoutes.route("/get-open-jobs").get(getOpenJobs);
// Get one job - Public
jobRoutes.route("/:id/get-job").get(getJob);

export default jobRoutes;