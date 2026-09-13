import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken, isInstructor } from "../middlewares/auth.middleware.js";
import { 
  addResource, 
  getResourcesByBatch, 
  toggleResourceVisibility,
  deleteResource 
} from "../controllers/resource.controller.js";

const resourceRoutes = express.Router();

// Adds a resource to a batch
resourceRoutes
  .route("/:batchId/add-resource")
  .post(verifyToken, isInstructor, upload.any(), addResource);

// Fetches batch resources for a specific batch
resourceRoutes
  .route("/batch/:batchId")
  .get(verifyToken, getResourcesByBatch);  

// for instructor to toggle resource visibility
resourceRoutes
  .route("/toggle-visibility/:resourceId")
  .patch(verifyToken, isInstructor, toggleResourceVisibility);

// DELETE  resource
resourceRoutes
  .route("/:resourceId")
  .delete(verifyToken, isInstructor, deleteResource);

export default resourceRoutes;