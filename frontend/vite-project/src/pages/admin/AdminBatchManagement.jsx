import React, { useState, useEffect } from 'react';
import { getAllBatches, createBatch, markBatchCompleted, deleteBatch, assignStudentToBatch, removeStudentFromBatch } from '../../api/batch.service';
import { getAllCourse } from '../../api/course.service';
import api from '../../api/apiInstance';
import toast from 'react-hot-toast';

export default function AdminBatchManagement() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states for creating a batch
  const [batchName, setBatchName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');

  // UI state: tracks which batch's student management panel is expanded
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);

      const [batchRes, courseRes] = await Promise.all([
        getAllBatches(),
        getAllCourse()
      ]);

      const userRes = await api.get('users/get-all-user').catch(() => ({ data: [] }));

      setBatches(batchRes.batches || []);
      setCourses(courseRes.courses || []);

      const allUsers = userRes.data?.users || userRes.data || [];
      setInstructors(allUsers.filter(user => user.role === 'instructor'));
      setStudents(allUsers.filter(user => user.role === 'student'));

    } catch (err) {
      console.error(err);
      toast.error("Failed to load batch management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();

    if (!batchName || !selectedCourse) {
      toast.error("Batch Name and Course are required.");
      return;
    }

    try {
      const response = await createBatch({
        batchname: batchName,
        course: selectedCourse,
        instructor: selectedInstructor || null
      });

      if (response && response.success === false) {
        toast.error(response.message || "Failed to create batch.");
        return;
      }

      toast.success("Batch created successfully.");
      setBatchName('');
      setSelectedCourse('');
      setSelectedInstructor('');
      setIsDrawerOpen(false);
      fetchData();

    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create batch.";

      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;

    try {
      await deleteBatch(id);
      toast.success("Batch deleted.");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete batch.");
    }
  };

  // use of fetchdata at end is causing to refresh
  // const handleAddStudent = async (batchId) => {
  //   const studentId = selectedStudentToAdd[batchId];

  //   if (!studentId) {
  //     toast.error("Please select a student to add.");
  //     return;
  //   }

  //   try {
  //     await assignStudentToBatch(batchId, studentId);

  //     toast.success("Student assigned to batch.");

  //     setSelectedStudentToAdd(prev => ({
  //       ...prev,
  //       [batchId]: ''
  //     }));

  //     fetchData();

  //   } catch (err) {
  //     toast.error(
  //       err.response?.data?.message ||
  //       "Failed to assign student."
  //     );
  //   }
  // };

  const handleAddStudent = async (batchId) => {
  const studentId = selectedStudentToAdd[batchId];

  if (!studentId) {
    toast.error("Please select a student to add.");
    return;
  }

  try {
    await assignStudentToBatch(batchId, studentId);

    const addedStudent = students.find(
      (student) => student._id === studentId
    );

    setBatches((prev) =>
      prev.map((batch) =>
        batch._id === batchId
          ? {
              ...batch,
              students: [...(batch.students || []), addedStudent]
            }
          : batch
      )
    );

    toast.success("Student assigned to batch.");

    setSelectedStudentToAdd((prev) => ({
      ...prev,
      [batchId]: ''
    }));

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Failed to assign student."
    );
  }
};

// const handleRemoveStudent = async (batchId, studentId) => {
//     if (!window.confirm("Remove this student from the cohort?")) return;

//     try {
//       await removeStudentFromBatch(batchId, studentId);

//       toast.success("Student removed from batch.");

//       fetchData();

//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//         "Failed to remove student."
//       );
//     }
//   };

  //```  # handleremovestudent from batch, without use of fetchdata at end, to avoid refresh
   ///```
  
  const handleRemoveStudent = async (batchId, studentId) => {
  if (!window.confirm("Remove this student from the cohort?")) return;

  try {
    await removeStudentFromBatch(batchId, studentId);

    setBatches((prev) =>
      prev.map((batch) =>
        batch._id === batchId
          ? {
              ...batch,
              students: (batch.students || []).filter(
                (student) => (student._id || student) !== studentId
              )
            }
          : batch
      )
    );

    toast.success("Student removed from batch.");

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Failed to remove student."
    );
  }
};

  // Mark batch completed / not completed
  const handleMarkCompleted = async (batch) => {
    const newStatus = !batch.isCompleted;

    const confirmationMessage = newStatus
      ? "Mark this batch as completed?"
      : "Mark this batch as not completed?";

    if (!window.confirm(confirmationMessage)) return;

    try {
      await markBatchCompleted(batch._id, newStatus);

      toast.success(
        newStatus
          ? "Batch marked as completed."
          : "Batch marked as not completed."
      );

      fetchData();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to update batch completion status."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm text-gray-500 font-medium">
        Loading enterprise configuration...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Enterprise Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Batch & Cohort Control Center
          </h2>

          <p className="text-xs text-gray-500 mt-0.5">
            Manage active learning cohorts, instructor assignments, and roster rosters.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
          + Create New Batch
        </button>



        
      </div>

      {/* Batch Listing Section */}
      <div className="space-y-3">

        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Active Cohorts ({batches.length})
          </h3>
        </div>

        {batches.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
            No active batches configured in the system.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 shadow-xs">

            {batches.map((batch) => {

              const enrolledStudents = batch.students || [];

              const availableStudents = students.filter(
                (s) =>
                  !enrolledStudents.some(
                    (enrolled) =>
                      (enrolled._id || enrolled) === s._id
                  )
              );

              const isExpanded = expandedBatchId === batch._id;

              return (
                <div
                  key={batch._id}
                  className="transition-colors hover:bg-gray-50/50"
                >

                  {/* Compact Row Header */}
                  <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="space-y-1">

                      <div className="flex items-center gap-2.5">

                        <span className="font-semibold text-sm text-gray-900">
                          {batch.batchname}
                        </span>

                        <span className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                          {batch.course?.coursename || "Unassigned Course"}
                        </span>

                      </div>

                      <div className="text-xs text-gray-500 flex items-center gap-4">

                        <span>
                          Instructor:{" "}
                          <strong className="text-gray-700">
                            {batch.instructor?.fullname ||
                              batch.instructor?.email ||
                              "Unassigned"}
                          </strong>
                        </span>

                        <span>
                          Enrolled:{" "}
                          <strong className="text-gray-700">
                            {enrolledStudents.length} students
                          </strong>
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 self-end sm:self-center">

                      {/* Completion Toggle */}
                      <button
                        type="button"
                        onClick={() => handleMarkCompleted(batch)}
                        className="flex items-center gap-2"
                        title={
                          batch.isCompleted
                            ? "Mark as not completed"
                            : "Mark as completed"
                        }
                      >

                        <span
                          className={`text-xs font-medium ${
                            batch.isCompleted
                              ? "text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          {batch.isCompleted
                            ? "Completed"
                            : "Not Completed"}
                        </span>

                        {/* iPhone-style switch */}
                        <span
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                            batch.isCompleted
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >

                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                              batch.isCompleted
                                ? "translate-x-5"
                                : "translate-x-0.5"
                            }`}
                          />

                        </span>

                      </button>

                      {/* Manage Roster */}
                      <button
                        onClick={() =>
                          setExpandedBatchId(
                            isExpanded
                              ? null
                              : batch._id
                          )
                        }
                        className={`text-xs font-medium px-3 py-1.5 rounded-md border transition ${
                          isExpanded
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isExpanded
                          ? 'Close Roster'
                          : `Manage Roster (${enrolledStudents.length})`}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(batch._id)}
                        className="text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md border border-transparent hover:border-red-200 transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  {/* Expandable Roster & Enrollment Panel */}
                  {isExpanded && (
                    <div className="bg-gray-50/80 border-t border-gray-200 p-4 sm:p-6 space-y-4">

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-md border border-gray-200 shadow-2xs">

                        <div className="text-xs font-medium text-gray-700">
                          Assign New Student to Cohort
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">

                          <select
                            value={selectedStudentToAdd[batch._id] || ''}
                            onChange={(e) =>
                              setSelectedStudentToAdd(prev => ({
                                ...prev,
                                [batch._id]: e.target.value
                              }))
                            }
                            className="flex-1 sm:w-72 border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                          >
                            <option value="">
                              {availableStudents.length === 0
                                ? "-- No eligible students available --"
                                : "-- Select student --"}
                            </option>

                            {availableStudents.map((s) => (
                              <option
                                key={s._id}
                                value={s._id}
                              >
                                {s.fullname} ({s.email})
                              </option>
                            ))}

                          </select>

                          <button
                            onClick={() =>
                              handleAddStudent(batch._id)
                            }
                            disabled={
                              availableStudents.length === 0
                            }
                            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition shrink-0"
                          >
                            Enroll
                          </button>

                        </div>

                      </div>

                      {/* Student Table List */}
                      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-2xs">

                        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                          Enrolled Roster ({enrolledStudents.length})
                        </div>

                        {enrolledStudents.length === 0 ? (

                          <div className="p-6 text-center text-xs text-gray-400 italic">
                            No students currently enrolled in this batch.
                          </div>

                        ) : (

                          <div className="divide-y divide-gray-200 max-h-56 overflow-y-auto">

                            {enrolledStudents.map((studentItem) => {

                              const studentId =
                                studentItem._id ||
                                studentItem;

                              const studentName =
                                studentItem.fullname ||
                                studentItem.email ||
                                "Student Name";

                              const studentEmail =
                                studentItem.email ||
                                "No email";

                              return (
                                <div
                                  key={studentId}
                                  className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-gray-50/50"
                                >

                                  <div className="flex items-center gap-3">

                                    <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-[10px]">
                                      {studentName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>

                                    <div>

                                      <span className="font-medium text-gray-900">
                                        {studentName}
                                      </span>

                                      <span className="text-gray-500 ml-2">
                                        ({studentEmail})
                                      </span>

                                    </div>

                                  </div>

                                  <button
                                    onClick={() =>
                                      handleRemoveStudent(
                                        batch._id,
                                        studentId
                                      )
                                    }
                                    className="text-red-600 hover:text-red-700 font-medium text-[11px] px-2 py-1 rounded hover:bg-red-50 transition"
                                  >
                                    Remove
                                  </button>

                                </div>
                              );
                            })}

                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Slide-Over Drawer Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-3xs z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-Over Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col ${
          isDrawerOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">

          <div>

            <h3 className="font-semibold text-gray-900 text-sm">
              Create New Batch
            </h3>

            <p className="text-xs text-gray-500 mt-0.5">
              Initialize a new learning cohort instance.
            </p>

          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xs font-semibold p-1.5 rounded-md hover:bg-gray-100"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleCreateBatch}
          className="p-6 space-y-4 flex-1 overflow-y-auto"
        >

          <div className="space-y-1">

            <label className="block text-xs font-medium text-gray-700">
              Batch Name
            </label>

            <input
              type="text"
              placeholder="e.g. Fall 2026 Advanced React Cohort"
              value={batchName}
              onChange={(e) =>
                setBatchName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              required
            />

          </div>

          <div className="space-y-1">

            <label className="block text-xs font-medium text-gray-700">
              Course Blueprint
            </label>

            <select
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              required
            >

              <option value="">
                -- Select Course Blueprint --
              </option>

              {courses.map((c) => (
                <option
                  key={c._id}
                  value={c._id}
                >
                  {c.coursename}
                </option>
              ))}

            </select>

          </div>

          <div className="space-y-1">

            <label className="block text-xs font-medium text-gray-700">
              Assigned Instructor (Optional)
            </label>

            <select
              value={selectedInstructor}
              onChange={(e) =>
                setSelectedInstructor(e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >

              <option value="">
                -- Select Instructor --
              </option>

              {instructors.map((ins) => (
                <option
                  key={ins._id}
                  value={ins._id}
                >
                  {ins.fullname || ins.email}
                </option>
              ))}

            </select>

          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-2">

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-gray-800 transition shadow-xs"
            >
              Save Batch
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}