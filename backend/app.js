// imp file step a.2
// includes server, express, middleware codes, define app and export it
import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import courseRoutes from "./src/routes/course.routes.js";
import invitationRoutes from "./src/routes/invitation.routes.js";
import resourceRoutes from "./src/routes/resource.routes.js";
import batchRoutes from "./src/routes/batch.routes.js"
import assignmentRoutes from "./src/routes/assignment.routes.js"
import blogRoutes from "./src/routes/blog.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
import emailContactRoutes from "./src/routes/emailcontact.routes.js";
import testimonialRoutes from "./src/routes/testimonial.route.js";
import enrollmentRoutes from "./src/routes/enrollment.routes.js";


const app = express();

// cors must be defined so that  backend allows specified frontend url to access backend api requests. otherwise it will be blocked .
// purpose of below code is to accepts api requests from specified url hosted address
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/invitation", invitationRoutes)
app.use("/api/resource", resourceRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/jobs', jobRoutes)
app.use("/api/contact", emailContactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.send("Training Management System API");
});

// this is for exception handling when in backend a non valid url path is requested.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "No such backend route is defined!",
  });
});
export default app;