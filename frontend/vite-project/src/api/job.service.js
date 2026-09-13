import api from "./apiInstance.js";

export const getAllJobs = async () => {
  try {
    const res = await api.get("/jobs/get-all-jobs");
    console.log("Get all jobs success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get all jobs error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getOpenJobs = async () => {
  try {
    const res = await api.get("/jobs/get-open-jobs");
    console.log("Get open jobs success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get open jobs error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getJob = async (id) => {
  try {
    const res = await api.get(`/jobs/${id}/get-job`);
    console.log("Get job success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get job error: ", error.response?.data || error.message);
    throw error;
  }
};

export const addJob = async (jobData) => {
  try {
    const res = await api.post("/jobs/add-job", jobData);
    console.log("Add job success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Add job error: ", error.response?.data || error.message);
    throw error;
  }
};

export const editJob = async (id, jobData) => {
  try {
    const res = await api.patch(`/jobs/${id}/edit-job`, jobData);
    console.log("Edit job success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Edit job error: ", error.response?.data || error.message);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const res = await api.delete(`/jobs/${id}/delete-job`);
    console.log("Delete job success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Delete job error: ", error.response?.data || error.message);
    throw error;
  }
};