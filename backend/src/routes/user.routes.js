import express from "express";

import {
  registerUser,  loginUser,  homePageBackend,  getAllUser,  logoutUser,  getMe,  updateUserRole,deleteUser,
  getUserDetails,
} from "../controllers/user.controller.js";

import {  registerValidation,  loginValidation,  validate,
} from "../middlewares/fieldValidation.middleware.js";

import {  verifyToken,  isAdmin,
} from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.route("/home").get(homePageBackend);

userRoutes.route("/register")  .post(registerValidation, validate, registerUser);

userRoutes.route("/login").post(loginValidation, validate, loginUser);

userRoutes  .route("/logoutUser")  .post(logoutUser);

userRoutes.route("/get-me")  .get(verifyToken, getMe);

userRoutes.route("/get-all-user").get(verifyToken, isAdmin, getAllUser);

userRoutes.route("/:id/details")  .get(verifyToken, isAdmin, getUserDetails);

userRoutes.route("/:id/update-role").patch(verifyToken, isAdmin, updateUserRole);

userRoutes.route("/:id/delete-user")  .delete(verifyToken, isAdmin, deleteUser);

export default userRoutes;