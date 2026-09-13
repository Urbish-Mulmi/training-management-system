import api from "./apiInstance";

// axios api handling:
// success: response.data
// error: error.response.data


export const createBatch = async (batchData) => {
  try {
    const res = await api.post("/batches", batchData);
    console.log("Create batch success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Create batch error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getAllBatches = async () => {
  try {
    const res = await api.get('/batches');
    console.log("Get all batches success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get all batches error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getBatchDetails = async (batchId) => {
  try {
    const res = await api.get(`/batches/${batchId}`);
    console.log("Get batch details success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get batch details error: ", error.response?.data || error.message);
    throw error;
  }
};

export const deleteBatch = async (batchId) => {
  try {
    const res = await api.delete(`/batches/${batchId}`);
    console.log("Delete batch success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Delete batch error: ", error.response?.data || error.message);
    throw error;
  }
};

export const assignStudentToBatch = async (batchId, studentId) => {
  try {
    const res = await api.patch(`/batches/${batchId}/assign-student`, { studentId });
    console.log("Assign student success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Assign student error: ", error.response?.data || error.message);
    throw error;
  }
};

export const removeStudentFromBatch = async (batchId, studentId) => {
  try {
    const res = await api.patch(`/batches/${batchId}/remove-student`, { studentId });
    console.log("Remove student success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Remove student error: ", error.response?.data || error.message);
    throw error;
  }
};

export const assignInstructorToBatch = async (batchId, instructorId) => {
  try {
    const res = await api.patch(`/batches/${batchId}/assign-instructor`, { instructorId });
    console.log("Assign instructor success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Assign instructor error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getInstructorBatches = async () => {
  try {
    const res = await api.get('/batches/instructor-batches');
    console.log("Get instructor batches success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get instructor batches error: ", error.response?.data || error.message);
    throw error;
  }
};

export const markBatchCompleted = async (batchId, isCompleted) => {
  try {
    const res = await api.patch(`/batches/${batchId}/complete`, {
      isCompleted,
    });

    return res.data;
  } catch (error) {
    console.error(
      "Mark batch completed error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ======================================================
// Assignment for specific batch
// ======================================================
//for instructor
export const createBatchAssignment = async (batchId, assignmentData) => {
  try {
    const res = await api.post(`/batches/${batchId}/assignments`, assignmentData);
    console.log("Create batch assignment success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Create batch assignment error: ", error.response?.data || error.message);
    throw error;
  }
};

// //for instructor
// export const getBatchAssignment

// //for instructor
// export const deleteBatchAssignment

// //for instructor
// export const gradeBatchAssignment

// //for students
// export const submitBatchAssignment


// ======================================================
// STUDENT CLASSROOM APIs
// ======================================================


export const getStudentBatches = async () => {
  try {
    const res = await api.get('/batches/my-enrollment');
    console.log("Get student batches success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get student batches error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getStudentBatchDetails = async (batchId) => {
  try {
    const res = await api.get(`/batches/${batchId}/classroom`);
    console.log("Get student batch details success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get student batch details error: ", error.response?.data || error.message);
    throw error;
  }
};