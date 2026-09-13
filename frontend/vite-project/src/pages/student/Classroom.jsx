import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentBatchDetails } from "../../api/batch.service";
import { getBatchAssignments, getMySubmission, submitAssignment } from "../../api/assignment.serivce";
import { getBatchResources } from "../../api/resource.service";
import { submitTestimonial } from "../../api/testimonial.service";
import toast from "react-hot-toast";

const Classroom = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [batchInfo, setBatchInfo] = useState(null);
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("resources");

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mySubmissions, setMySubmissions] = useState({});

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [testimonialSubmitting, setTestimonialSubmitting] = useState(false);
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchClassroomDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [batchRes, assignRes, resourceRes] = await Promise.all([
          getStudentBatchDetails(batchId),
          getBatchAssignments(batchId).catch(() => ({ data: [] })),
          getBatchResources(batchId).catch(() => ({ data: [] }))
        ]);

        const batchPayload = batchRes?.data || batchRes;
        const targetBatch =
          batchPayload?.batch ||
          batchPayload?.data?.batch ||
          batchPayload;

        const fetchedResources =
          resourceRes?.resources ||
          resourceRes?.data?.resources ||
          resourceRes?.data ||
          [];

        const fetchedAssignments =
          assignRes?.data ||
          assignRes?.assignments ||
          assignRes ||
          [];

        if (isMounted) {
          setBatchInfo(targetBatch);
          setResources(
            Array.isArray(fetchedResources) ? fetchedResources : []
          );
          setAssignments(
            Array.isArray(fetchedAssignments) ? fetchedAssignments : []
          );

          const subMap = {};

          for (const asm of fetchedAssignments) {
            try {
              const subRes = await getMySubmission(asm._id);

              if (subRes?.data) {
                subMap[asm._id] = subRes.data;
              }
            } catch (err) {
              // Ignore unsubmitted errors
            }
          }

          setMySubmissions(subMap);
        }
      } catch (err) {
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load classroom details.";

        if (isMounted) {
          setError(errMsg);
          toast.error(errMsg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (batchId) fetchClassroomDetails();

    return () => {
      isMounted = false;
    };
  }, [batchId]);

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment) return;

    if (!file && !githubUrl) {
      toast.error("Please provide a PDF file or a GitHub repository URL.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      if (file) formData.append("file", file);
      if (githubUrl) formData.append("githubUrl", githubUrl);

      const res = await submitAssignment(
        selectedAssignment._id,
        formData
      );

      toast.success(
        res.message || "Assignment submitted successfully!"
      );

      setMySubmissions((prev) => ({
        ...prev,
        [selectedAssignment._id]: res.data
      }));

      setSelectedAssignment(null);
      setFile(null);
      setGithubUrl("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please write your feedback.");
      return;
    }

    try {
      setTestimonialSubmitting(true);

      const res = await submitTestimonial(batchId, {
        rating,
        feedback,
      });

      toast.success(
        res.message || "Feedback submitted successfully."
      );

      setTestimonialSubmitted(true);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit feedback."
      );
    } finally {
      setTestimonialSubmitting(false);
    }
  };

  const closeTestimonialModal = () => {
    setShowTestimonialModal(false);

    if (testimonialSubmitted) {
      setRating(0);
      setFeedback("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          <p className="text-xs text-gray-500">
            Loading your classroom...
          </p>
        </div>
      </div>
    );
  }

  if (error || !batchInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate("/student/my-courses")}
          className="text-sm text-blue-600 hover:text-blue-800 transition mb-4 inline-flex items-center gap-1"
        >
          &larr; Back to My Courses
        </button>

        <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          <p className="font-semibold">
            Unable to load classroom
          </p>

          <p className="text-sm mt-1 text-red-600">
            {error || "Classroom details not found."}
          </p>
        </div>
      </div>
    );
  }

  const course = batchInfo?.course || {};
  const instructor = batchInfo?.instructor;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-7">

      {/* Back */}
      <button
        onClick={() => navigate("/student/my-courses")}
        className="text-xs font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-1"
      >
        &larr; Back to My Courses
      </button>

      {/* ======================================================
          CLASSROOM HERO
      ====================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white shadow-lg">

        {/* Decorative graphics */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute top-20 right-24 w-24 h-24 bg-cyan-300/10 rounded-full"></div>
        <div className="absolute -bottom-20 left-1/3 w-48 h-48 bg-purple-300/10 rounded-full"></div>

        <div className="relative p-7">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Hero information */}
            <div className="max-w-2xl">

              <div className="flex flex-wrap items-center gap-2 mb-4">

                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 bg-white/15 border border-white/20 rounded-full">
                  Your Classroom
                </span>

                <span className="text-[10px] font-medium px-3 py-1.5 bg-white/10 border border-white/15 rounded-full">
                  Batch: {batchInfo?.batchname || batchInfo?.name || "N/A"}
                </span>

                {batchInfo?.isCompleted && (
                  <span className="text-[10px] font-semibold px-3 py-1.5 bg-emerald-400/20 text-emerald-100 border border-emerald-300/20 rounded-full">
                    Completed
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {course?.coursename || "Classroom"}
              </h1>

              <p className="text-sm text-blue-100 mt-3 leading-relaxed max-w-xl">
                {course?.coursedescription ||
                  "Welcome to your digital classroom."}
              </p>

              {instructor && (
                <div className="mt-6 flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-sm font-bold">
                    {(instructor?.fullname ||
                      instructor?.name ||
                      "I")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-blue-200">
                      Instructor
                    </p>

                    <p className="text-xs font-semibold text-white mt-0.5">
                      {instructor?.fullname ||
                        instructor?.name ||
                        "Unassigned"}
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* Classroom stats graphic */}
            <div className="shrink-0 grid grid-cols-2 gap-3">

              <div className="w-32 p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-cyan-300/20 flex items-center justify-center mb-3">
                  <span className="text-sm">▤</span>
                </div>

                <p className="text-2xl font-bold">
                  {resources.length}
                </p>

                <p className="text-[10px] text-blue-100 mt-0.5">
                  Resources
                </p>
              </div>

              <div className="w-32 p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-violet-300/20 flex items-center justify-center mb-3">
                  <span className="text-sm">✓</span>
                </div>

                <p className="text-2xl font-bold">
                  {assignments.length}
                </p>

                <p className="text-[10px] text-blue-100 mt-0.5">
                  Assignments
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ======================================================
          COMPLETION FEEDBACK
      ====================================================== */}
      {batchInfo?.isCompleted && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-emerald-100 rounded-xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
                ★
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Course completed
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  You finished this batch. Share your experience with future students.
                </p>
              </div>

            </div>

            <button
              onClick={() => setShowTestimonialModal(true)}
              className="shrink-0 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
            >
              Give Feedback
            </button>

          </div>
        </div>
      )}

      {/* ======================================================
          TABS
      ====================================================== */}
      <div className="flex items-center gap-2 border-b border-gray-200">

        <button
          onClick={() => setActiveTab("resources")}
          className={`relative px-4 py-3 text-xs font-semibold transition ${
            activeTab === "resources"
              ? "text-blue-700"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-md flex items-center justify-center ${
                activeTab === "resources"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              ▤
            </span>

            Study Resources

            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {resources.length}
            </span>
          </span>

          {activeTab === "resources" && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("assignments")}
          className={`relative px-4 py-3 text-xs font-semibold transition ${
            activeTab === "assignments"
              ? "text-violet-700"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-md flex items-center justify-center ${
                activeTab === "assignments"
                  ? "bg-violet-100 text-violet-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              ✓
            </span>

            Assignments

            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {assignments.length}
            </span>
          </span>

          {activeTab === "assignments" && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-violet-600 rounded-full"></span>
          )}
        </button>

      </div>

      {/* ======================================================
          RESOURCES
      ====================================================== */}
      {activeTab === "resources" && (
        <div className="space-y-4">

          {resources.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                ▤
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mt-4">
                No study resources yet
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Your instructor has not uploaded resources for this batch.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {resources.map((item, index) => (
                <div
                  key={item._id}
                  className="group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition overflow-hidden"
                >

                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      index % 3 === 0
                        ? "bg-blue-500"
                        : index % 3 === 1
                        ? "bg-violet-500"
                        : "bg-cyan-500"
                    }`}
                  ></div>

                  <div className="flex justify-between items-start gap-4">

                    <div className="flex gap-3">

                      <div
                        className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-sm ${
                          index % 3 === 0
                            ? "bg-blue-50 text-blue-600"
                            : index % 3 === 1
                            ? "bg-violet-50 text-violet-600"
                            : "bg-cyan-50 text-cyan-600"
                        }`}
                      >
                        ▤
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.resourcename}
                        </h3>

                        {item.uploadedby && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            Uploaded by {item.uploadedby.fullname}
                          </p>
                        )}
                      </div>

                    </div>

                    <span className="shrink-0 text-[10px] px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 font-semibold rounded-full">
                      {item.resourcecategory}
                    </span>

                  </div>

                  {item.resourceurl && (
                    <a
                      href={item.resourceurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                    >
                      <span>Open Resource</span>
                      <span className="group-hover:translate-x-1 transition">
                        &rarr;
                      </span>
                    </a>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* ======================================================
          ASSIGNMENTS
      ====================================================== */}
      {activeTab === "assignments" && (
        <div className="space-y-4">

          {assignments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center text-xl">
                ✓
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mt-4">
                No assignments yet
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Your instructor has not assigned any work for this batch.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {assignments.map((assignment, index) => {
                const sub = mySubmissions[assignment._id];
                const isOverdue =
                  new Date() > new Date(assignment.dueDate);

                return (
                  <div
                    key={assignment._id}
                    className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                  >

                    {/* Colored top strip */}
                    <div
                      className={`h-1 ${
                        sub
                          ? "bg-emerald-500"
                          : isOverdue
                          ? "bg-red-500"
                          : index % 2 === 0
                          ? "bg-blue-500"
                          : "bg-violet-500"
                      }`}
                    ></div>

                    <div className="p-5 flex flex-col justify-between h-full">

                      <div className="space-y-3">

                        <div className="flex justify-between items-start gap-3">

                          <div className="flex items-start gap-3">

                            <div className="w-9 h-9 shrink-0 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900 pt-1">
                              {assignment.title}
                            </h3>

                          </div>

                          <span
                            className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-semibold ${
                              sub
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : isOverdue
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {sub
                              ? "Submitted"
                              : isOverdue
                              ? "Overdue"
                              : "Pending"}
                          </span>

                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">
                          {assignment.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">

                          <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                            Due date
                          </span>

                          <span
                            className={`text-xs font-semibold ${
                              isOverdue && !sub
                                ? "text-red-600"
                                : "text-gray-700"
                            }`}
                          >
                            {new Date(
                              assignment.dueDate
                            ).toLocaleDateString()}
                          </span>

                        </div>

                        {assignment.fileUrl && (
                          <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Download Assignment Material &rarr;
                          </a>
                        )}

                        {sub && (
                          <div className="mt-3 p-3 bg-emerald-50/60 rounded-lg text-xs space-y-1.5 border border-emerald-100">

                            <p className="text-gray-700">
                              <span className="font-semibold">
                                Grade:
                              </span>{" "}
                              {sub.grade || "Pending"}
                            </p>

                            {sub.feedback && (
                              <p className="text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-700">
                                  Feedback:
                                </span>{" "}
                                {sub.feedback}
                              </p>
                            )}

                          </div>
                        )}

                      </div>

                      <button
                        onClick={() =>
                          setSelectedAssignment(assignment)
                        }
                        className="w-full mt-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-lg transition shadow-sm"
                      >
                        {sub
                          ? "Update Submission"
                          : "Submit Assignment"}
                      </button>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

      {/* ======================================================
          ASSIGNMENT SUBMISSION MODAL
      ====================================================== */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">

            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="p-6 space-y-5">

              <div className="flex justify-between items-start gap-4">

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                    Assignment Submission
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {selectedAssignment.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={handleFileUploadSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Upload Document
                  </label>

                  <div className="border-2 border-dashed border-blue-100 bg-blue-50/40 rounded-xl p-4">

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setFile(e.target.files[0])
                      }
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />

                    <p className="text-[10px] text-gray-400 mt-2">
                      PDF files only
                    </p>

                  </div>
                </div>

                <div className="relative">

                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      or
                    </span>
                    <div className="h-px flex-1 bg-gray-100"></div>
                  </div>

                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    GitHub Repository URL
                  </label>

                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) =>
                      setGithubUrl(e.target.value)
                    }
                    className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />

                </div>

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAssignment(null)
                    }
                    className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Confirm Submission"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          TESTIMONIAL MODAL
      ====================================================== */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">

            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>

            <div className="p-6 space-y-5">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">
                    Course Feedback
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Give Your Feedback
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Share your experience with this course.
                  </p>
                </div>

                <button
                  onClick={closeTestimonialModal}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                >
                  ✕
                </button>

              </div>

              {testimonialSubmitted ? (
                <div className="text-center py-8">

                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                    ✓
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-4">
                    Feedback Submitted
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for your feedback. Your testimonial is now
                    waiting for admin approval.
                  </p>

                  <button
                    onClick={closeTestimonialModal}
                    className="mt-6 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Close
                  </button>

                </div>
              ) : (
                <form
                  onSubmit={handleTestimonialSubmit}
                  className="space-y-6"
                >

                  <div>

                    <label className="block text-xs font-semibold text-gray-700 mb-3">
                      How would you rate this course?
                    </label>

                    <div className="flex items-center gap-2">

                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`w-11 h-11 rounded-lg text-2xl transition ${
                            star <= rating
                              ? "bg-amber-50 text-amber-400 border border-amber-200"
                              : "bg-gray-50 text-gray-300 border border-gray-100 hover:bg-amber-50 hover:text-amber-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}

                    </div>

                    {rating > 0 && (
                      <p className="text-[10px] text-amber-600 font-medium mt-2">
                        {rating === 5
                          ? "Excellent"
                          : rating === 4
                          ? "Very Good"
                          : rating === 3
                          ? "Good"
                          : rating === 2
                          ? "Needs Improvement"
                          : "Poor"}
                      </p>
                    )}

                  </div>

                  <div>

                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Your Feedback
                    </label>

                    <textarea
                      value={feedback}
                      onChange={(e) =>
                        setFeedback(e.target.value)
                      }
                      rows="5"
                      placeholder="Share your experience with this course..."
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none transition"
                    />

                  </div>

                  <div className="flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setShowTestimonialModal(false)
                      }
                      className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={testimonialSubmitting}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50 shadow-sm"
                    >
                      {testimonialSubmitting
                        ? "Submitting..."
                        : "Submit Feedback"}
                    </button>

                  </div>

                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Classroom;