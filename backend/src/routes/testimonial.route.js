import express from "express";

import {
  submitTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../controllers/testimonial.controller.js";

import {
  verifyToken,
  isAdmin,
  isStudent,
} from "../middlewares/auth.middleware.js";

const testimonialRoutes = express.Router();

// ======================================================
// TESTIMONIAL MANAGEMENT
// ======================================================

// Get all testimonials - Admin
testimonialRoutes
  .route("/get-all-testimonials")
  .get(verifyToken, isAdmin, getAllTestimonials);

// Get approved testimonials - Public
testimonialRoutes
  .route("/get-approved-testimonials")
  .get(getApprovedTestimonials);

// Submit testimonial - Student
testimonialRoutes
  .route("/:batchId/submit-testimonial")
  .post(verifyToken, isStudent, submitTestimonial);

// Update testimonial status - Admin
testimonialRoutes
  .route("/:id/update-status")
  .patch(verifyToken, isAdmin, updateTestimonialStatus);

// Delete testimonial - Admin
testimonialRoutes
  .route("/:id/delete-testimonial")
  .delete(verifyToken, isAdmin, deleteTestimonial);

export default testimonialRoutes;