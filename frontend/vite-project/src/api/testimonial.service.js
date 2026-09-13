import api from "./apiInstance";

// axios api handling:
// success: response.data
// error: error.response.data

export const submitTestimonial = async (batchId, testimonialData) => {
  try {
    const res = await api.post(
      `/testimonials/${batchId}/submit-testimonial`,
      testimonialData
    );
    console.log("Submit testimonial success: ", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Submit testimonial error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getApprovedTestimonials = async () => {
  try {
    const res = await api.get("/testimonials/get-approved-testimonials");
    console.log("Get approved testimonials success: ", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Get approved testimonials error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllTestimonials = async () => {
  try {
    const res = await api.get("/testimonials/get-all-testimonials");
    console.log("Get all testimonials success: ", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Get all testimonials error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTestimonialStatus = async (id, status) => {
  try {
    const res = await api.patch(`/testimonials/${id}/update-status`, {
      status,
    });
    console.log("Update testimonial status success: ", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Update testimonial status error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const res = await api.delete(`/testimonials/${id}/delete-testimonial`);
    console.log("Delete testimonial success: ", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Delete testimonial error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};