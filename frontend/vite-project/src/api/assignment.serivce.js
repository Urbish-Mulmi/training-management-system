import api from "./apiInstance.js";

// 1. GET ALL ASSIGNMENTS FOR A BATCH
export const getBatchAssignments = async (batchId) => {
  try {
    const res = await api.get(`/assignments/batch/${batchId}`);
    return res.data;
  } catch (error) {
    console.error("Error in getting batch assignments:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 2. CREATE ASSIGNMENT (INSTRUCTOR)
export const createAssignment = async (batchId, payload) => {
  try {
    const res = await api.post(`/assignments/batch/${batchId}`, payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error in creating assignment:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 3. DELETE ASSIGNMENT (INSTRUCTOR)
export const deleteAssignment = async (assignmentId) => {
  try {
    const res = await api.delete(`/assignments/${assignmentId}`);
    return res.data;
  } catch (error) {
    console.error("Error in deleting assignment:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 4. SUBMIT ASSIGNMENT (STUDENT)
export const submitAssignment = async (assignmentId, payload) => {
  try {
    const res = await api.post(`/assignments/${assignmentId}/submit`, payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error in submitting assignment:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 5. GRADE SUBMISSION (INSTRUCTOR)
export const gradeSubmission = async (submissionId, payload) => {
  try {
    const res = await api.patch(`/assignments/submissions/${submissionId}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error in grading submission:", error.response?.data?.message || error.message);
    throw error;
  }
};

// ==========================================
// 🆕 ADDED FUNCTIONS
// ==========================================

// 6. GET MY SUBMISSION (STUDENT)
// Checks if current logged-in student has already submitted for this assignment
export const getMySubmission = async (assignmentId) => {
  try {
    const res = await api.get(`/assignments/${assignmentId}/my-submission`);
    return res.data;
  } catch (error) {
    console.error("Error fetching student submission:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 7. GET ALL SUBMISSIONS FOR AN ASSIGNMENT (INSTRUCTOR)
// Fetch all student submissions so instructor can review & grade them
export const getAssignmentSubmissions = async (assignmentId) => {
  try {
    const res = await api.get(`/assignments/${assignmentId}/submissions`);
    return res.data;
  } catch (error) {
    console.error("Error fetching assignment submissions:", error.response?.data?.message || error.message);
    throw error;
  }
};