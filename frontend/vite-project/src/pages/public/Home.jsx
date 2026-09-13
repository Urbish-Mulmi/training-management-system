import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllCourse } from "../../api/course.service";
import CourseCard from "../../components/CourseCard";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getAllCourse();

        const courseList = Array.isArray(res)
          ? res
          : res.data || res.courses || [];

        setCourses(courseList);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Learn. Build. Move Forward.
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Build skills that
              <span className="text-blue-600"> move your career forward.</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-7 mt-6 max-w-2xl">
              Discover practical training programs designed to help you
              learn new skills, work on real projects, and prepare for
              your next career opportunity.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <a
                href="#courses"
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Explore Courses
              </a>

              <NavLink
                to="/job-placement"
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:border-gray-400 hover:text-gray-900 transition"
              >
                Explore Careers
              </NavLink>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Training Programs
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-2xl font-bold text-gray-900">
                Practical
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Learning Approach
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-2xl font-bold text-gray-900">
                Career
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Support & Guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section
        id="courses"
        className="max-w-6xl mx-auto px-6 py-16"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Start Learning
            </p>

            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Our Courses
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Explore the training programs currently available.
            </p>
          </div>

          {courses.length > 0 && (
            <p className="text-xs text-gray-400">
              {courses.length} course{courses.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-12">
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin"></div>
            <p className="text-sm text-gray-500">
              Loading courses...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white border border-red-200 rounded-lg p-6">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* No courses */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
              —
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mt-4">
              No courses available
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              New training programs will appear here when available.
            </p>
          </div>
        )}

        {/* Course Cards */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}
          </div>
        )}
      </section>

      {/* Simple CTA */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Your Next Step
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              Ready to start learning?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Find a course that matches your goals and take the next step.
            </p>
          </div>

          <NavLink
            to="/register"
            className="shrink-0 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Create an Account
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;