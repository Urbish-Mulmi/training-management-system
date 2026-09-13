import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentBatches } from "../../api/batch.service";
import toast from "react-hot-toast";

const StudentBatches = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getStudentBatches();

        const batchList =
          res?.batches ||
          res?.data ||
          (Array.isArray(res) ? res : []);

        if (isMounted) {
          setBatches(batchList);
        }

      } catch (err) {
        console.error("Fetch enrolled batches error:", err);

        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load enrolled courses.";

        if (isMounted) {
          setError(errMsg);
          toast.error(errMsg);
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBatches();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64 text-sm text-gray-500">
          Loading your courses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-700">
            Unable to load your courses
          </p>

          <p className="text-xs text-red-600 mt-1">
            {error}
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Page Header */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-5">

        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            My Courses
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            View your enrolled batches and enter your classrooms.
          </p>
        </div>

        <span className="text-xs text-gray-500">
          {batches.length} {batches.length === 1 ? "course" : "courses"}
        </span>

      </div>

      {/* Empty State */}
      {batches.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">

          <h3 className="text-sm font-medium text-gray-900">
            No enrolled courses
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            You are not currently enrolled in any active batches.
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Contact your administrator if you believe this is an error.
          </p>

        </div>
      ) : (

        /* Course List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {batches.map((batch) => {

            const course = batch.course || {};
            const instructor = batch.instructor;

            return (
              <div
                key={batch._id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs hover:border-gray-300 transition flex flex-col justify-between"
              >

                {/* Course Information */}
                <div>

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {course.coursename || "Course Name Unavailable"}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Batch: {batch.batchname || batch.name || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-medium px-2 py-1 rounded border ${
                        batch.isCompleted
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {batch.isCompleted ? "Completed" : "Active"}
                    </span>

                  </div>

                  <p className="text-xs text-gray-500 mt-4 line-clamp-2">
                    {course.coursedescription ||
                      "No course description provided."}
                  </p>

                  {/* Course Details */}
                  <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">
                        Instructor
                      </p>

                      <p className="text-xs font-medium text-gray-700 mt-0.5">
                        {instructor?.fullname || "Unassigned"}
                      </p>
                    </div>

                    {course.duration && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                          Duration
                        </p>

                        <p className="text-xs font-medium text-gray-700 mt-0.5">
                          {course.duration} {course.unit}(s)
                        </p>
                      </div>
                    )}

                  </div>

                </div>

                {/* Action */}
                <button
                  onClick={() =>
                    navigate(`/student/classroom/${batch._id}`)
                  }
                  className="w-full mt-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-md transition"
                >
                  Enter Classroom
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default StudentBatches;