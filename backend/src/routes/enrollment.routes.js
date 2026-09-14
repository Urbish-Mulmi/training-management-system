import express from "express";

import {
  createEnrollment,
   getMyEnrollments,
  initiateEsewaPayment,
  verifyEsewaPayment,
  esewaPaymentFailure,
  getPendingPaidEnrollments,
  getBatchesForCourse,
  approveEnrollment
} from "../controllers/enrollment.controller.js";

import {
  verifyToken,
  isAdmin
} from "../middlewares/auth.middleware.js";

const enrollmentRoutes = express.Router();


/*
|--------------------------------------------------------------------------
| Student enrollment
|--------------------------------------------------------------------------
*/
enrollmentRoutes.get(
  "/my",  verifyToken,  getMyEnrollments
);
enrollmentRoutes.post(
  "/",  verifyToken,  createEnrollment
);

enrollmentRoutes.post(
  "/:enrollmentId/pay",verifyToken,  initiateEsewaPayment
);


/*
|--------------------------------------------------------------------------
| eSewa callbacks
|--------------------------------------------------------------------------
*/

enrollmentRoutes.get(  "/payment/success",  verifyEsewaPayment
);

enrollmentRoutes.get(  "/payment/failure",  esewaPaymentFailure
);


/*
|--------------------------------------------------------------------------
| Admin enrollment management
|--------------------------------------------------------------------------
*/

enrollmentRoutes.get(
  "/admin/pending",
  verifyToken,
  isAdmin,
  getPendingPaidEnrollments
);

enrollmentRoutes.get(
  "/admin/course/:courseId/batches",
  verifyToken,
  isAdmin,
  getBatchesForCourse
);

enrollmentRoutes.patch(
  "/:enrollmentId/approve",
  verifyToken,
  isAdmin,
  approveEnrollment
);


export default enrollmentRoutes;