import { useEffect, useState } from "react";
import { getInstructorBatches } from "../../api/batch.service";

const StudentManagement = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorBatchesData = async () => {
      try {
        setError("");
        const data = await getInstructorBatches();
        setBatches(data.batches || data || []);
      } catch (error) {
        console.error(
          "Error fetching instructor batches:",
          error.response?.data || error.message
        );
        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch student batches"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorBatchesData();
  }, []);

  if (loading) {
    return <p className="p-12 text-center text-gray-400">Loading student rosters...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600 font-medium">Error: {error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">My Students by Batch</h1>
        <p className="text-sm text-gray-500">View enrolled students, contact emails, and direct GitHub links across your assigned batches.</p>
      </div>

      {batches.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          No batches or students found.
        </div>
      ) : (
        <div className="space-y-6">
          {batches.map((batch) => {
            const studentList = batch.students || [];
            return (
              <div key={batch._id} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase">
                      Batch: {batch.batchname}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 mt-1">
                      {batch.course?.coursename || "Unnamed Course"}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-lg self-start sm:self-center">
                    Total Students: {studentList.length}
                  </span>
                </div>

                {studentList.length === 0 ? (
                  <p className="text-sm text-gray-400 italic py-4">No students enrolled in this batch yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                          <th className="py-3 px-3">Student Name</th>
                          <th className="py-3 px-3">Email</th>
                          <th className="py-3 px-3 text-right">GitHub Profile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {studentList.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-3 font-medium text-gray-900">
                              {student.fullname || student.name || "N/A"}
                            </td>
                            <td className="py-3 px-3 text-gray-500 text-xs">
                              {student.email || "N/A"}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {student.githubUrl ? (
                                <a
                                  href={student.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                  View GitHub &rarr;
                                </a>
                              ) : (
                                <span className="text-xs text-gray-400 italic">Not provided</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;