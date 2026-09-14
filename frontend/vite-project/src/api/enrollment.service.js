import api from "./apiInstance";


export const createEnrollment = async (courseId) => {
  try {
    const res = await api.post("/enrollments", {
      courseId
    });

    console.log(
      "Create enrollment success:",
      res.data
    );

    return res.data;
  } catch (error) {
    console.error(
      "Create enrollment error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

export const getMyEnrollments = async () => {
  try {
    const res = await api.get("/enrollments/my");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const initiateEsewaPayment = async (
  enrollmentId
) => {
  try {
    const res = await api.post(
      `/enrollments/${enrollmentId}/pay`
    );

    console.log(
      "eSewa payment initiated:",
      res.data
    );

    return res.data;
  } catch (error) {
    console.error(
      "eSewa payment error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN: Get paid pending enrollments
|--------------------------------------------------------------------------
*/

export const getPendingPaidEnrollments =
  async () => {
    try {
      const res = await api.get(
        "/enrollments/admin/pending"
      );

      return res.data;
    } catch (error) {
      console.error(
        "Get pending enrollments error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };


/*
|--------------------------------------------------------------------------
| ADMIN: Get batches for course
|--------------------------------------------------------------------------
*/

export const getBatchesForCourse =
  async (courseId) => {
    try {
      const res = await api.get(
        `/enrollments/admin/course/${courseId}/batches`
      );

      return res.data;
    } catch (error) {
      console.error(
        "Get batches error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };


/*
|--------------------------------------------------------------------------
| ADMIN: Approve enrollment
|--------------------------------------------------------------------------
*/

export const approveEnrollment = async (
  enrollmentId,
  batchId
) => {
  try {
    const res = await api.patch(
      `/enrollments/${enrollmentId}/approve`,
      {
        batchId
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "Approve enrollment error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};