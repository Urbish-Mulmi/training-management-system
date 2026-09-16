import express from "express";
import { addCourse, getCourse, deleteCourse, editCourse, getAllCourse,searchCourse, } from "../controllers/course.controller.js";
import { createCourseValidation } from "../middlewares/createCourseValidation.js";
import { updateCourseValidation } from "../middlewares/updateCourseValidation.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const courseRoutes = express.Router();

courseRoutes.route("/get-all-course").get(getAllCourse);
courseRoutes.route("/search").get(searchCourse);
courseRoutes.route("/:id/get-course").get(getCourse);
courseRoutes.route("/add-course").post(verifyToken, isAdmin, upload.single("syllabus"), createCourseValidation, addCourse);
courseRoutes.route("/:id/delete-course").delete(verifyToken, isAdmin, deleteCourse);
courseRoutes.route("/:id/edit-course").patch(verifyToken, isAdmin, upload.single("syllabus"), updateCourseValidation, editCourse);

export default courseRoutes;