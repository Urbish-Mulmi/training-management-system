import React, { useState, useEffect, useCallback } from "react";
import { getInstructorBatches } from '../../api/batch.service.js';
import {
  getBatchAssignments,
  createAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  gradeSubmission
} from '../../api/assignment.serivce.js';
import toast from "react-hot-toast";

const AssignmentManagement = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Modal Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submissions Modal State
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [gradingInputs, setGradingInputs] = useState({});

  // Fetch batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const res = await getInstructorBatches();
        const batchData = res.batches || res || [];
        setBatches(batchData);
        if (batchData.length > 0) {
          setSelectedBatchId(batchData[0]._id);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load assigned batches.");
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, []);

  // Fetch assignments when selectedBatchId changes
  const fetchAssignments = useCallback(async (batchId) => {
    if (!batchId) return;
    try {
      setLoadingAssignments(true);
      const res = await getBatchAssignments(batchId);
      setAssignments(res.assignments || res.data || res || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load assignments.");
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      fetchAssignments(selectedBatchId);
    }
  }, [selectedBatchId, fetchAssignments]);

  const openCreateModal = () => {
    setEditingAssignment(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingAssignment(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 16) : "");
    setFile(null);
    setShowModal(true);
  };

  // Open Submissions Modal & Fetch Submissions
  const openSubmissionsModal = async (assignment) => {
    setSelectedAssignmentForSubmissions(assignment);
    setShowSubmissionsModal(true);
    setLoadingSubmissions(true);
    try {
      const res = await getAssignmentSubmissions(assignment._id);
      const fetchedSubs = res.submissions || res.data || res || [];
      setSubmissions(fetchedSubs);
      
      // Initialize grading inputs with current grades or default to "Pending"
      const initialInputs = {};
      fetchedSubs.forEach((sub) => {
        initialInputs[sub._id] = {
          grade: sub.grade || "Pending",
          feedback: sub.feedback || ""
        };
      });
      setGradingInputs(initialInputs);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load submissions.");
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Save Grade Handler
  const handleSaveGrade = async (submissionId) => {
    const input = gradingInputs[submissionId] || {};
    try {
      await gradeSubmission(submissionId, {
        grade: input.grade || "Pending",
        feedback: input.feedback
      });
      toast.success("Grade saved successfully!");
      
      // Refresh submissions list
      if (selectedAssignmentForSubmissions) {
        const res = await getAssignmentSubmissions(selectedAssignmentForSubmissions._id);
        setSubmissions(res.submissions || res.data || res || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save grade.");
    }
  };

  // Create or Update Assignment Handler
  const handleSaveAssignment = async (e) => {
    e.preventDefault();

    if (!selectedBatchId) {
      toast.error("Please select a batch first.");
      return;
    }

    setSubmitting(true);

    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append("title", title);
        if (description) payload.append("description", description);
        payload.append("dueDate", new Date(dueDate).toISOString());
        payload.append("assignmentFile", file);
      } else {
        payload = {
          title,
          description,
          dueDate: new Date(dueDate).toISOString(),
        };
      }

      if (editingAssignment) {
        await createAssignment(selectedBatchId, payload); 
        toast.success("Assignment saved successfully.");
      } else {
        await createAssignment(selectedBatchId, payload);
        toast.success("Assignment published successfully.");
      }

      // Reset Form & Close Modal
      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      setEditingAssignment(null);
      setShowModal(false);

      // Refresh list
      fetchAssignments(selectedBatchId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Assignment Handler
  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteAssignment(assignmentId);
      toast.success("Assignment deleted.");
      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete assignment.");
    }
  };

  if (loadingBatches) {
    return <p className="p-12 text-center text-gray-400">Loading batches...</p>;
  }

  const selectedBatch = batches.find((b) => b._id === selectedBatchId);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header & Batch Selector */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-sm text-gray-500">
            Publish new assignments and view submitted coursework for your batches.
          </p>
        </div>

        {batches.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-gray-600 uppercase">Batch:</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white font-medium"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.batchname} — {b.course?.coursename || "Unnamed Course"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {batches.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          No assigned batches found.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase">
                {selectedBatch?.batchname}
              </span>
              <h2 className="text-base font-semibold text-gray-800 mt-1">
                {selectedBatch?.course?.coursename || "Selected Course"}
              </h2>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              + Create Assignment
            </button>
          </div>

          {/* Assignments List */}
          {loadingAssignments ? (
            <p className="text-center py-8 text-xs text-gray-400">Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
              No assignments published for this batch yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 pt-1">
                      <span>📅 Due: {new Date(item.dueDate).toLocaleString()}</span>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          📄 Attachment PDF
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openSubmissionsModal(item)}
                      className="px-3 py-1.5 text-xs text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    >
                      View Submissions
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-3 py-1.5 text-xs text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(item._id)}
                      className="px-3 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingAssignment ? "Edit Assignment" : "Create Assignment"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Express REST API Lab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Instructions, guidelines, or criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Due Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Attachment File (PDF) {editingAssignment && "(Leave blank to keep current file)"}
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-gray-600 border border-gray-300 p-2 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingAssignment
                    ? "Update Assignment"
                    : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions & Grading Modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Submissions Review</h3>
                <p className="text-xs text-gray-500">{selectedAssignmentForSubmissions?.title}</p>
              </div>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {loadingSubmissions ? (
              <p className="text-center py-8 text-xs text-gray-400">Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">No submissions found for this assignment yet.</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => {
                  const currentInput = gradingInputs[sub._id] || { grade: sub.grade || "Pending", feedback: sub.feedback || "" };

                  return (
                    <div key={sub._id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">
                          {sub.student?.name || "Student"} ({sub.student?.email})
                        </span>
                        <span className="text-gray-400">
                          Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        {sub.fileUrl && (
                          <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">
                            📄 View PDF Submission
                          </a>
                        )}
                        {sub.githubUrl && (
                          <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">
                            🔗 View GitHub Link
                          </a>
                        )}
                      </div>

                      {/* Grading Input Fields */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <select
                          value={currentInput.grade}
                          onChange={(e) =>
                            setGradingInputs({
                              ...gradingInputs,
                              [sub._id]: { ...currentInput, grade: e.target.value }
                            })
                          }
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 w-32 outline-none focus:border-indigo-500 bg-white font-medium"
                        >
                          <option value="Pending">Pending</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Feedback notes..."
                          value={currentInput.feedback}
                          onChange={(e) =>
                            setGradingInputs({
                              ...gradingInputs,
                              [sub._id]: { ...currentInput, feedback: e.target.value }
                            })
                          }
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 flex-1 outline-none focus:border-indigo-500 bg-white"
                        />
                        <button
                          onClick={() => handleSaveGrade(sub._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Save Grade
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;