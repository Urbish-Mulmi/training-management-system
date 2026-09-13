import React, { useState, useEffect, useRef } from "react";
import {
  getAllJobs,
  getJob,
  addJob,
  editJob,
  deleteJob,
} from "../../api/job.service";
import toast from "react-hot-toast";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deadlineError, setDeadlineError] = useState("");
  const [linkError, setLinkError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const linkValidationTimeout = useRef(null);

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    deadline: "",
    applicationType: "email",
    applicationLink: "",
    status: "open",
  });

  const validateDeadline = (dateValue) => {
    if (!dateValue) return "Deadline is required.";

    const selectedDate = new Date(dateValue);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return "Deadline must be a future date (tomorrow or later).";
    }

    return "";
  };

  const validateLink = (type, value) => {
    if (!value) return "Application link/email is required.";

    if (type === "email") {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(value)) {
        return "Invalid email format. Must be like name@domain.com";
      }
    }

    if (type === "linkedin") {
      const linkedinRegex =
        /^https:\/\/(www\.)?(linkedin\.com|lnkd\.in)\/.+$/i;

      if (!linkedinRegex.test(value)) {
        return "Invalid LinkedIn URL.";
      }
    }

    return "";
  };

  const formatDateForInput = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.jobs || []);
      setCurrentPage(1);
    } catch (err) {
      toast.error("Failed to load jobs.");
    }
  };

  useEffect(() => {
    fetchJobs();

    return () => {
      clearTimeout(linkValidationTimeout.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJobData({
      ...jobData,
      [name]: value,
    });

    if (name === "applicationLink") {
      clearTimeout(linkValidationTimeout.current);

      linkValidationTimeout.current = setTimeout(() => {
        const error = validateLink(
          jobData.applicationType,
          value
        );

        setLinkError(error);

        if (error && value) {
          toast.error(error);
        }
      }, 500);
    }

    if (name === "deadline") {
      const error = validateDeadline(value);

      setDeadlineError(error);

      if (error && value) {
        toast.error(
          "Deadline cannot be today or a past date."
        );
      }
    }
  };

  const handleApplicationTypeChange = (e) => {
    const newType = e.target.value;

    clearTimeout(linkValidationTimeout.current);

    setJobData({
      ...jobData,
      applicationType: newType,
      applicationLink: "",
    });

    setLinkError("");
  };

  const handleOpenAdd = () => {
    clearTimeout(linkValidationTimeout.current);

    setEditingJobId(null);
    setDeadlineError("");
    setLinkError("");

    setJobData({
      title: "",
      company: "",
      location: "",
      description: "",
      requirements: "",
      deadline: "",
      applicationType: "email",
      applicationLink: "",
      status: "open",
    });

    setIsDrawerOpen(true);
  };

  const handleOpenEdit = async (id) => {
    try {
      clearTimeout(linkValidationTimeout.current);

      setLoading(true);
      setDeadlineError("");
      setLinkError("");

      const res = await getJob(id);
      const data = res.job || res.data || res;

      setEditingJobId(id);

      setJobData({
        title: data.title || "",
        company: data.company || "",
        location: data.location || "",
        description: data.description || "",
        requirements: Array.isArray(data.requirements)
          ? data.requirements.join(", ")
          : "",
        deadline: data.deadline
          ? formatDateForInput(data.deadline)
          : "",
        applicationType: data.applicationType || "email",
        applicationLink: data.applicationLink || "",
        status: data.status || "open",
      });

      setIsDrawerOpen(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearTimeout(linkValidationTimeout.current);

    const currentDeadlineError = validateDeadline(
      jobData.deadline
    );

    const currentLinkError = validateLink(
      jobData.applicationType,
      jobData.applicationLink
    );

    if (currentDeadlineError || currentLinkError) {
      setDeadlineError(currentDeadlineError);
      setLinkError(currentLinkError);

      toast.error(
        "Please fix the validation errors before submitting."
      );

      return;
    }

    try {
      setLoading(true);

      const jobPayload = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        requirements: jobData.requirements
          .split(",")
          .map((req) => req.trim())
          .filter(Boolean),
        deadline: jobData.deadline,
        applicationType: jobData.applicationType,
        applicationLink: jobData.applicationLink,
        status: jobData.status,
      };

      if (editingJobId) {
        const res = await editJob(
          editingJobId,
          jobPayload
        );

        toast.success(
          res.message || "Job updated successfully!"
        );
      } else {
        const res = await addJob(jobPayload);

        toast.success(
          res.message || "Job created successfully!"
        );
      }

      setIsDrawerOpen(false);
      fetchJobs();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Job operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job?"
      )
    ) {
      return;
    }

    try {
      await deleteJob(id);

      toast.success("Job deleted successfully.");

      fetchJobs();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  const totalPages = Math.ceil(
    jobs.length / jobsPerPage
  );

  const startIndex =
    (currentPage - 1) * jobsPerPage;

  const currentJobs = jobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Job Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage job opportunities and placement listings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Add Job
        </button>
      </div>

      {loading && !isDrawerOpen ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border border-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mt-5"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 mt-2"></div>
              <div className="h-9 bg-gray-200 rounded mt-5"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No jobs available
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Add a job opportunity to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {jobs.length}{" "}
              {jobs.length === 1 ? "job" : "jobs"}
            </p>

            {totalPages > 1 && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {job.title}
                  </h3>

                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
                      job.status === "open"
                        ? "text-green-700 bg-green-50 border border-green-100"
                        : "text-gray-600 bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {job.status === "open"
                      ? "Open"
                      : "Closed"}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-600 mt-2">
                  {job.company}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                  <span>📍</span>
                  <span className="truncate">
                    {job.location}
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mt-3 line-clamp-2">
                  {job.description}
                </p>

                {job.requirements?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.requirements
                      .slice(0, 4)
                      .map((requirement, index) => (
                        <span
                          key={index}
                          className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded"
                        >
                          {requirement}
                        </span>
                      ))}

                    {job.requirements.length > 4 && (
                      <span className="text-xs text-gray-500 px-1 py-1">
                        +{job.requirements.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400">
                      Deadline
                    </p>

                    <p className="text-xs font-medium text-gray-700 mt-0.5">
                      {job.deadline
                        ? new Date(
                            job.deadline
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleOpenEdit(job._id)
                      }
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(job._id)
                      }
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              <button
                onClick={() =>
                  goToPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 text-sm rounded-lg border ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  goToPage(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingJobId
                    ? "Edit Job"
                    : "Add Job"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {editingJobId
                    ? "Update job opportunity details."
                    : "Create a new job opportunity."}
                </p>
              </div>

              <button
                onClick={() =>
                  setIsDrawerOpen(false)
                }
                className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleChange}
                  placeholder="e.g. Sipalaya Info Tech"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu, Nepal"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and opportunity..."
                  rows="5"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>

                <input
                  type="text"
                  name="requirements"
                  value={jobData.requirements}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Git"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Separate requirements with commas.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={jobData.deadline}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    deadlineError
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                {deadlineError && (
                  <p className="text-xs text-red-600 mt-1">
                    {deadlineError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Type
                </label>

                <div className="flex gap-5">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="applicationType"
                      value="email"
                      checked={
                        jobData.applicationType ===
                        "email"
                      }
                      onChange={
                        handleApplicationTypeChange
                      }
                    />
                    Email
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="applicationType"
                      value="linkedin"
                      checked={
                        jobData.applicationType ===
                        "linkedin"
                      }
                      onChange={
                        handleApplicationTypeChange
                      }
                    />
                    LinkedIn
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {jobData.applicationType ===
                  "email"
                    ? "Application Email"
                    : "LinkedIn URL"}
                </label>

                <input
                  type={
                    jobData.applicationType ===
                    "email"
                      ? "email"
                      : "url"
                  }
                  name="applicationLink"
                  value={jobData.applicationLink}
                  onChange={handleChange}
                  placeholder={
                    jobData.applicationType ===
                    "email"
                      ? "hr@company.com"
                      : "https://lnkd.in/p/gqBuWJqZ"
                  }
                  required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    linkError
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                {linkError ? (
                  <p className="text-xs text-red-600 mt-1">
                    {linkError}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    {jobData.applicationType ===
                    "email"
                      ? "Enter the email address applicants should contact."
                      : "Enter a LinkedIn or lnkd.in URL."}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={jobData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">
                    Open
                  </option>
                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsDrawerOpen(false)
                  }
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading
                    ? "Saving..."
                    : editingJobId
                    ? "Update Job"
                    : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}