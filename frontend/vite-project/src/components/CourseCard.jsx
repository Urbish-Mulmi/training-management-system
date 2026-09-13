import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full">
      <div className="p-5 flex flex-col h-full">

        {/* Course name */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {course.coursename}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.coursedescription}
        </p>

        {/* Course information */}
        <div className="space-y-2 text-sm text-gray-700 mb-5">
          <p>
            <span className="font-medium">Duration:</span>{" "}
            {course.duration}{course.unit}
          </p>

          <p>
            <span className="font-medium">Fee:</span>{" "}
            Rs. {course.fee}
          </p>
        </div>

        {/* Button pushed to bottom */}
        <button
          onClick={() => navigate(`/courses/${course._id}`)}
          className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          View Course
        </button>

      </div>
    </div>
  );
};

export default CourseCard;

