import api from "./apiInstance.js";

// 1. ADD RESOURCE (Handles FormData file upload or external link body)
export const addResource = async (batchId, payload) => {
  try {
    const res = await api.post(`/resource/${batchId}/add-resource`, payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error in adding resource:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 2. GET RESOURCES BY BATCH
export const getBatchResources = async (batchId) => {
  try {
    const res = await api.get(`/resource/batch/${batchId}`);
    return res.data;
  } catch (error) {
    console.error("Error in getting batch resources:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 3. TOGGLE RESOURCE VISIBILITY
export const toggleResourceVisibility = async (resourceId) => {
  try {
    const res = await api.patch(`/resource/toggle-visibility/${resourceId}`);
    return res.data;
  } catch (error) {
    console.error("Error in toggling resource visibility:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 4. DELETE RESOURCE
export const deleteResource = async (resourceId) => {
  try {
    const res = await api.delete(`/resource/${resourceId}`);
    return res.data;
  } catch (error) {
    console.error("Error in deleting resource:", error.response?.data?.message || error.message);
    throw error;
  }
};