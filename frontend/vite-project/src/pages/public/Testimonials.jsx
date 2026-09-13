import React, { useEffect, useState } from "react";
import { getApprovedTestimonials } from "../../api/testimonial.service";
import toast from "react-hot-toast";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getApprovedTestimonials();

        const testimonialList =
          res?.testimonials ||
          res?.data ||
          [];

        setTestimonials(
          Array.isArray(testimonialList)
            ? testimonialList
            : []
        );
      } catch (err) {
        console.error("Fetch testimonials error:", err);

        toast.error(
          err?.response?.data?.message ||
            "Failed to load testimonials."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const closeModal = () => {
    setSelectedTestimonial(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-gray-200 border-t-gray-700 animate-spin"></div>

          <p className="text-xs text-gray-500">
            Loading student reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Student Reviews
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            See what students have to say about their learning experience.
          </p>
        </div>

        {/* Testimonials */}
        {testimonials.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            <h2 className="text-sm font-semibold text-gray-900">
              No reviews yet
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Student reviews will appear here once they are approved.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => {
              const studentName =
                testimonial.student?.fullname ||
                "Student";

              const courseName =
                testimonial.batch?.course?.coursename ||
                "Course";

              return (
                <button
                  key={testimonial._id}
                  onClick={() =>
                    setSelectedTestimonial(testimonial)
                  }
                  className="group text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
                >
                  {/* Course + Rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {courseName}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1">
                        Student review
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= testimonial.rating
                              ? "text-yellow-500"
                              : "text-gray-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Review */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      "{testimonial.feedback}"
                    </p>

                    <span className="inline-block mt-2 text-[10px] font-medium text-gray-500 group-hover:text-gray-900 transition">
                      Read more →
                    </span>
                  </div>

                  {/* Student */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-semibold">
                      {studentName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {studentName}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Student
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TESTIMONIAL DETAIL MODAL */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Student review
                  </p>

                  <h2 className="text-xl font-semibold text-gray-900 mt-1">
                    {selectedTestimonial.batch?.course?.coursename ||
                      "Course"}
                  </h2>
                </div>

                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-900 text-lg transition"
                >
                  ✕
                </button>
              </div>

              {/* Rating */}
              <div className="mt-5 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-base ${
                      star <= selectedTestimonial.rating
                        ? "text-yellow-500"
                        : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}

                <span className="text-xs text-gray-400 ml-2">
                  {selectedTestimonial.rating}/5
                </span>
              </div>

              {/* Review */}
              <div className="mt-7">
                <span className="text-4xl leading-none text-gray-200 font-serif">
                  “
                </span>

                <p className="text-base text-gray-700 leading-7 -mt-2">
                  {selectedTestimonial.feedback}
                </p>
              </div>

              {/* Student */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold">
                    {(
                      selectedTestimonial.student?.fullname ||
                      "Student"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedTestimonial.student?.fullname ||
                        "Student"}
                    </p>

                    <p className="text-xs text-gray-400">
                      Student
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonials;