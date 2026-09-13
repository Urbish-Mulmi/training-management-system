// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import ResourceSection from '../../components/courses/ResourceSection';
// import { getOneCourse } from '../../api/course.service';
// import toast from 'react-hot-toast';

// export default function CourseDetails() {
//   const { courseId, id } = useParams();
//   const activeCourseId = courseId || id;
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchCourseDetails = async () => {
//       if (!activeCourseId) {
//         toast.error("Invalid course identifier.");
//         navigate(-1);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await getOneCourse(activeCourseId);
        
//         // Safely extract course data regardless of backend response structure wrappers
//         const courseData = response?.course || response?.data || response;
        
//         if (isMounted) {
//           setCourse(courseData);
//         }
//       } catch (err) {
//         console.error("Failed to retrieve course details:", err);
//         toast.error(err?.response?.data?.message || "Failed to load course details.");
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchCourseDetails();

//     return () => {
//       isMounted = false;
//     };
//   }, [activeCourseId, navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
//         <p className="text-gray-600 font-medium">The requested course could not be found.</p>
//         <button 
//           onClick={() => navigate(-1)} 
//           className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       {/* Course Overview Header */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
//         <div className="space-y-1">
//           <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Course Curriculum</span>
//           <h1 className="text-2xl font-bold text-gray-900">{course.coursename}</h1>
//         </div>

//         <div className="text-gray-700 text-sm leading-relaxed space-y-2">
//           <p><strong>Description:</strong> {course.coursedescription}</p>
//           <p><strong>Prerequisites:</strong> {course.prerequisite || "None specified"}</p>
//         </div>
//       </div>

//       {/* Shared Resource Section Component */}
//       <ResourceSection courseId={course._id || activeCourseId} canManage={false} />
//     </div>
//   );
// }

//------

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneCourse } from "../../api/course.service";
import toast from "react-hot-toast";

export default function CourseDetails() {
  const { courseId, id } = useParams();
  const activeCourseId = courseId || id;
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCourseDetails = async () => {
      if (!activeCourseId) {
        toast.error("Invalid course identifier.");
        navigate(-1);
        return;
      }

      try {
        setLoading(true);

        const response = await getOneCourse(activeCourseId);
        const courseData = response?.course || response?.data || response;

        if (isMounted) {
          setCourse(courseData);
        }
      } catch (err) {
        console.error("Failed to retrieve course details:", err);

        toast.error(
          err?.response?.data?.message ||
            "Failed to load course details."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourseDetails();

    return () => {
      isMounted = false;
    };
  }, [activeCourseId, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin"></div>
          <p className="text-sm text-gray-500">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
            ?
          </div>

          <p className="text-gray-900 font-semibold mt-4">
            Course not found
          </p>

          <p className="text-sm text-gray-500 mt-1">
            The requested course could not be found.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <span className="text-base">←</span>
          Back to Courses
        </button>

        {/* Main Course Card */}
        <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden shadow-sm">

          {/* Course Header */}
          <div>
            {course.image?.url && (
              <div className="w-full h-64 md:h-72 bg-gray-100 overflow-hidden">
                <img
                  src={course.image.url}
                  alt={course.coursename}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="px-7 md:px-9 py-8">
              <div className="flex items-start gap-4">
                <div className="w-1 h-14 bg-blue-600 rounded-full shrink-0"></div>

                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Training Program
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-2">
                    {course.coursename}
                  </h1>

                  <p className="text-gray-600 text-base leading-7 mt-4 max-w-4xl">
                    {course.coursedescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="border-t border-blue-100 px-6 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

              {/* Left Content */}
              <div className="lg:col-span-2 space-y-6">

                {/* Course Information */}
                <section className="border border-gray-200 rounded-lg p-6">
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Course Information
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-1">
                      About this course
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                    <div className="pb-4 border-b border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Course Name
                      </p>

                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {course.coursename}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Duration
                      </p>

                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {course.duration
                          ? `${course.duration} ${course.unit || ""}`
                          : "Not specified"}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Course Fee
                      </p>

                      <p className="text-sm font-semibold text-blue-600 mt-2">
                        {course.fee !== undefined &&
                        course.fee !== null
                          ? `Rs. ${course.fee}`
                          : "Not specified"}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Prerequisite
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-2 leading-6">
                        {course.prerequisite ||
                          "No prerequisite specified"}
                      </p>
                    </div>

                  </div>
                </section>

                {/* Course Description */}
                <section className="border border-gray-200 rounded-lg p-6">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Course Description
                  </p>

                  <h2 className="text-xl font-semibold text-gray-900 mt-1 mb-5">
                    What this course covers
                  </h2>

                  <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">
                    {course.coursedescription}
                  </p>
                </section>

                {/* Prerequisites */}
                <section className="border border-gray-200 rounded-lg p-6">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Prerequisites
                  </p>

                  <h2 className="text-xl font-semibold text-gray-900 mt-1 mb-5">
                    Before you begin
                  </h2>

                  {course.prerequisite ? (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm text-blue-600">
                        ✓
                      </div>

                      <p className="text-sm text-gray-600 leading-6">
                        {course.prerequisite}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No specific prerequisites are required for this
                      course.
                    </p>
                  )}
                </section>

                {/* Syllabus */}
                <section className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Course Syllabus
                      </p>

                      <h2 className="text-xl font-semibold text-gray-900 mt-1">
                        Curriculum
                      </h2>

                      <p className="text-sm text-gray-500 leading-6 mt-2 max-w-xl">
                        Review the course syllabus to understand the
                        planned curriculum and topics covered in the
                        training program.
                      </p>
                    </div>

                    {course.syllabus?.url && (
                      <a
                        href={course.syllabus.url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Syllabus
                      </a>
                    )}
                  </div>

                  {!course.syllabus?.url && (
                    <div className="mt-5 border border-gray-100 bg-gray-50 rounded-md p-5">
                      <p className="text-sm text-gray-500">
                        A syllabus has not been uploaded for this
                        course yet.
                      </p>
                    </div>
                  )}
                </section>

              </div>

              {/* Right Sidebar */}
              <aside>
                <div className="border border-blue-100 bg-gray-50 rounded-lg p-6 lg:sticky lg:top-24">

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      i
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Course Overview
                      </p>

                      <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
                        At a glance
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 leading-6">
                    Review the key details of this training program
                    before getting started.
                  </p>

                  <div className="border-t border-gray-200 mt-6 pt-5 space-y-5">

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Duration
                      </p>

                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {course.duration
                          ? `${course.duration} ${course.unit || ""}`
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Course Fee
                      </p>

                      <p className="text-xl font-semibold text-blue-600 mt-1">
                        {course.fee !== undefined &&
                        course.fee !== null
                          ? `Rs. ${course.fee}`
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Prerequisite
                      </p>

                      <p className="text-sm text-gray-600 leading-6 mt-1">
                        {course.prerequisite || "None specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Syllabus
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {course.syllabus?.url
                          ? "Available"
                          : "Not uploaded"}
                      </p>
                    </div>

                  </div>

                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <button
                      onClick={() => navigate(`/enroll/${activeCourseId}`)}
                      className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Enroll Now
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Login or create an account to enroll.
                    </p>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

