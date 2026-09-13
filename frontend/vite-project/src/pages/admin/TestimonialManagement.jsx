import React, { useEffect, useState } from "react";
import {
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../../api/testimonial.service";
import toast from "react-hot-toast";

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const res = await getAllTestimonials();

      setTestimonials(res.testimonials || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        "Failed to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateTestimonialStatus(id, status);

      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial._id === id
            ? { ...testimonial, status: res.testimonial.status }
            : testimonial
        )
      );

      toast.success(
        status === "approved"
          ? "Testimonial approved."
          : "Testimonial rejected."
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to update testimonial."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await deleteTestimonial(id);

      setTestimonials((prev) =>
        prev.filter((testimonial) => testimonial._id !== id)
      );

      toast.success("Testimonial deleted.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to delete testimonial."
      );
    }
  };

  const filteredTestimonials =
    filter === "all"
      ? testimonials
      : testimonials.filter(
          (testimonial) => testimonial.status === filter
        );

  const pendingCount = testimonials.filter(
    (testimonial) => testimonial.status === "pending"
  ).length;

  const approvedCount = testimonials.filter(
    (testimonial) => testimonial.status === "approved"
  ).length;

  const rejectedCount = testimonials.filter(
    (testimonial) => testimonial.status === "rejected"
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm text-gray-500 font-medium">
        Loading testimonials...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
          Testimonial Management
        </h2>

        <p className="text-xs text-gray-500 mt-0.5">
          Review student feedback and control which testimonials are publicly displayed.
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">

        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
            filter === "all"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          All ({testimonials.length})
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
            filter === "pending"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Pending ({pendingCount})
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
            filter === "approved"
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Approved ({approvedCount})
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
            filter === "rejected"
              ? "bg-red-100 text-red-800 border-red-200"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Rejected ({rejectedCount})
        </button>

      </div>

      {/* Testimonials */}
      {filteredTestimonials.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-500">
          No testimonials found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 shadow-xs">

          {filteredTestimonials.map((testimonial) => (

            <div
              key={testimonial._id}
              className="p-5 hover:bg-gray-50/50 transition"
            >

              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                <div className="space-y-1">

                  <div className="flex items-center gap-2">

                    <span className="font-semibold text-sm text-gray-900">
                      {testimonial.student?.fullname || "Unknown Student"}
                    </span>

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        testimonial.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : testimonial.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {testimonial.status}
                    </span>

                  </div>

                  <div className="text-xs text-gray-500">
                    {testimonial.student?.email}
                  </div>

                  <div className="text-xs text-gray-500">
                    Batch:{" "}
                    <strong className="text-gray-700">
                      {testimonial.batch?.batchname || "Unknown Batch"}
                    </strong>
                  </div>

                </div>

                {/* Rating */}
                <div className="text-right shrink-0">

                  <div className="text-sm tracking-wide">
                    {"★".repeat(testimonial.rating)}
                    {"☆".repeat(5 - testimonial.rating)}
                  </div>

                  <div className="text-[10px] text-gray-500 mt-1">
                    {testimonial.rating}/5
                  </div>

                </div>

              </div>

              {/* Feedback */}
              <div className="mt-4 bg-gray-50 border border-gray-100 rounded-md p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{testimonial.feedback}"
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                <span className="text-[10px] text-gray-400">
                  Submitted{" "}
                  {testimonial.createdAt
                    ? new Date(testimonial.createdAt).toLocaleDateString()
                    : ""}
                </span>

                <div className="flex items-center gap-2">

                  {testimonial.status !== "approved" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          testimonial._id,
                          "approved"
                        )
                      }
                      className="text-xs font-medium px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
                    >
                      Approve
                    </button>
                  )}

                  {testimonial.status !== "rejected" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          testimonial._id,
                          "rejected"
                        )
                      }
                      className="text-xs font-medium px-3 py-1.5 rounded-md bg-white hover:bg-red-50 text-red-600 border border-red-200 transition"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(testimonial._id)
                    }
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-500 border border-gray-300 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}