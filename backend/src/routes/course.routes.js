// import express from "express";

// import {
//   addCourse,
//   getCourse,
//   deleteCourse,
//   editCourse,
//   getAllCourse,
// } from "../controllers/course.controller.js";

// import { createCourseValidation } from "../middlewares/createCourseValidation.js";
// import { updateCourseValidation } from "../middlewares/updateCourseValidation.js";

// import {
//   verifyToken,
//   isAdmin,
// } from "../middlewares/auth.middleware.js";

// const courseRoutes = express.Router();

// // ======================================================
// // COURSE BLUEPRINT MANAGEMENT
// // ======================================================

// // Get all courses
// courseRoutes
//   .route("/get-all-course")
//   .get(getAllCourse);

// // Get one course
// courseRoutes
//   .route("/:id/get-course")
//   .get(getCourse);

// // Add course (Admin only usually, keep your middleware if needed)
// courseRoutes
//   .route("/add-course")
//   .post(
//     verifyToken,
//     isAdmin,
//     createCourseValidation,
//     addCourse
//   );

// // Delete course
// courseRoutes
//   .route("/:id/delete-course")
//   .delete(
//     verifyToken,
//     isAdmin,
//     deleteCourse
//   );

// // Edit course
// courseRoutes
//   .route("/:id/edit-course")
//   .patch(
//     verifyToken,
//     isAdmin,
//     updateCourseValidation,
//     editCourse
//   );

// export default courseRoutes;

import express from "express";
import { addCourse, getCourse, deleteCourse, editCourse, getAllCourse } from "../controllers/course.controller.js";
import { createCourseValidation } from "../middlewares/createCourseValidation.js";
import { updateCourseValidation } from "../middlewares/updateCourseValidation.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const courseRoutes = express.Router();

courseRoutes.route("/get-all-course").get(getAllCourse);
courseRoutes.route("/:id/get-course").get(getCourse);
courseRoutes.route("/add-course").post(verifyToken, isAdmin, upload.single("syllabus"), createCourseValidation, addCourse);
courseRoutes.route("/:id/delete-course").delete(verifyToken, isAdmin, deleteCourse);
courseRoutes.route("/:id/edit-course").patch(verifyToken, isAdmin, upload.single("syllabus"), updateCourseValidation, editCourse);

export default courseRoutes;