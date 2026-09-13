import express from "express";

import {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const blogRoutes = express.Router();

// Get all blogs - Admin
blogRoutes.route("/get-all-blogs").get(verifyToken, isAdmin, getAllBlogs);

// Create blog - Admin
blogRoutes.route("/add-blog").post(verifyToken, isAdmin, upload.single("featuredImage"), createBlog);

// Update blog - Admin
blogRoutes.route("/:id/edit-blog").patch(verifyToken, isAdmin, upload.single("featuredImage"), updateBlog);

// Delete blog - Admin
blogRoutes.route("/:id/delete-blog").delete(verifyToken, isAdmin, deleteBlog);

// Get published blogs - Public
blogRoutes.route("/get-published-blogs").get(getPublishedBlogs);

// Get one blog - Public
blogRoutes.route("/:id/get-blog").get(getBlog);


export default blogRoutes;