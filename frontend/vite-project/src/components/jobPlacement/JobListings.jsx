import React, { useEffect, useState } from "react";
import { getOpenJobs } from "../../api/job.service";
import toast from "react-hot-toast";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 10;

  const fetchJobs = async () => {
    try {
      const res = await getOpenJobs();
      setJobs(res.jobs || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load job opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Opportunities
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Current Job Opportunities
          </h2>

          <p className="text-gray-600 mt-2">
            Explore current openings shared through our
            placement network.
          </p>
        </div>

        {!loading && jobs.length > 0 && (
          <span className="text-sm text-gray-500">
            {jobs.length}{" "}
            {jobs.length === 1
              ? "position"
              : "positions"}{" "}
            available
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
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
            No open positions right now
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Check back later for new opportunities.
          </p>
        </div>
      ) : (
        <>
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

                  <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Open
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">
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
                          className="text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded"
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

                  <button
                    onClick={() =>
                      setSelectedJob(job)
                    }
                    className="text-xs font-medium bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
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

      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Currently hiring
                  </span>

                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {selectedJob.title}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {selectedJob.company} ·{" "}
                    {selectedJob.location}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedJob(null)
                  }
                  className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Location
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {selectedJob.location}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Application Deadline
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {selectedJob.deadline
                      ? new Date(
                          selectedJob.deadline
                        ).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="font-semibold text-gray-900">
                  Job Description
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mt-2 whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.requirements?.length > 0 && (
                <div className="mt-7">
                  <h3 className="font-semibold text-gray-900">
                    Requirements
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {selectedJob.requirements.map(
                      (requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <span className="text-blue-600 mt-0.5">
                            ✓
                          </span>

                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div className="border-t border-gray-200 mt-8 pt-6">
                {selectedJob.applicationType ===
                "email" ? (
                  <a
                    href={`mailto:${selectedJob.applicationLink}`}
                    className="block text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Apply via Email
                  </a>
                ) : (
                  <a
                    href={
                      selectedJob.applicationLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Apply on LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default JobListings;