import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Testimonials from "./pages/public/Testimonials.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Public Pages
import Home from "./pages/public/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/SignUp.jsx";
import Getme from "./pages/public/GetMe.jsx";
import LogOut from "./pages/auth/Logout.jsx";
import CourseDetails from "./pages/public/CourseDetails.jsx";
import Onboarding from "./pages/public/Onboarding.jsx";
import JobPlacement from "./pages/public/JobPlacement.jsx";
import Blogs from "./pages/public/Blogs";
import BlogDetails from "./pages/public/BlogDetails";
import Contact from "./pages/public/Contact.jsx";
import Enrollment from "./pages/public/Enrollment.jsx";
import PaymentSuccess from "./pages/public/PaymentSuccess.jsx";
import PaymentFailure from "./pages/public/PaymentFailure.jsx";
import EsewaPayTest from "./pages/public/EsewaPayTest.jsx";
import MyEnrollments from "./pages/public/MyEnrollments.jsx";
// Layouts
import AdminLayout from "./pages/layouts/AdminLayout.jsx";
import InstructorLayout from "./pages/layouts/InstructorLayout.jsx";
import StudentLayout from "./pages/layouts/StudentLayout.jsx";

// Admin Pages
import UserManagement from "./pages/admin/UserManagement.jsx";
import AdminCourseManagement from "./pages/admin/CourseManagement.jsx";
import AdminBatchManagement from "./pages/admin/AdminBatchManagement.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
import AdminJobManagement from "./pages/admin/JobManagement.jsx";
import BlogManagement from "./pages/admin/BlogManagement.jsx";
import TestimonialManagement from "./pages/admin/TestimonialManagement.jsx";

// Instructor Pages
import InstructorCourseManagement from "./pages/instructor/CourseManagement.jsx";
import StudentManagement from "./pages/instructor/StudentManagement.jsx";
import AssignmentManagement from "./pages/instructor/AssignmentManagement";

// Student Pages
import StudentBatches from "./pages/student/StudentBatches.jsx";
import Classroom from "./pages/student/Classroom.jsx";
import PageNotFound from "./pages/public/PageNotFound.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();

  // console.log("env", import.meta.env.VITE_DEBUG);

  return (
    <>
      <Toaster position="top-right" />
      

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <ScrollToTop />

        <main className="flex-1 min-w-0">
          <Routes>
            {/* Public Routes */}

            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/get-me" element={<Getme />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/job-placement" element={<JobPlacement />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/enroll/:courseId" element={<Enrollment />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/esewa-payment-help" element={<EsewaPayTest />} />
            <Route path="/esewapaymenthelp" element={<EsewaPayTest />} />
            <Route path="/my-enrollments"  element={<MyEnrollments />}/>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="batches" element={<AdminBatchManagement />} />
              <Route
                path="testimonials"
                element={<TestimonialManagement />}
              />
              <Route
                path="courses"
                element={<AdminCourseManagement />}
              />
              <Route
                path="courses/:id/edit-course"
                element={<EditCourse />}
              />
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="jobs" element={<AdminJobManagement />} />
            </Route>

            {/* Instructor Routes */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="students" replace />} />
              <Route
                path="students"
                element={<StudentManagement />}
              />
              <Route
                path="courses"
                element={<InstructorCourseManagement />}
              />
              <Route
                path="courses/:id/edit-course"
                element={<EditCourse />}
              />
              <Route
                path="assignments"
                element={<AssignmentManagement />}
              />
            </Route>

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="my-courses" replace />}
              />
              <Route
                path="my-courses"
                element={<StudentBatches />}
              />
              <Route
                path="classroom/:batchId"
                element={<Classroom />}
              />
            </Route>
          </Routes>
        </main>

        {!location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/instructor") &&
        !location.pathname.startsWith("/student") && <Footer />}
      </div>
    </>
  );
}

export default App;