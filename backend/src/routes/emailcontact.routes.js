import express from "express";
import { sendContactMessage } from "../controllers/emailcontact.controller.js";

const emailContactRoutes = express.Router();

emailContactRoutes.post("/send-message", sendContactMessage);

export default emailContactRoutes;