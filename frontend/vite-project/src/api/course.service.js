import api from "./apiInstance.js";

// ======================================================
// CORE COURSE BLUEPRINT APIs
// ======================================================

export const getAllCourse = async () => {
  try {
    const res = await api.get("/course/get-all-course");
    console.log("All courses:", res.data);
    return res.data;
  } catch (error) {
    console.error("Get all courses error:", error.response?.data || error.message);
    throw error;
  }
};

export const getOneCourse = async (id) => {
  try {
    const res = await api.get(`/course/${id}/get-course`);
    return res.data;
  } catch (error) {
    console.error("Get one course error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const res = await api.delete(`/course/${id}/delete-course`);
    return res.data;
  } catch (error) {
    console.error("Delete course error:", error.response?.data || error.message);
    throw error;
  }
};

export const addCourse = async (courseData) => {
  try {
    const res = await api.post("/course/add-course", courseData);
    return res.data;
  } catch (error) {
    console.error("Add course error:", error.response?.data || error.message);
    throw error;
  }
};

export const editCourse = async (id, courseData) => {
  try {
    const res = await api.patch(`/course/${id}/edit-course`, courseData);
    return res.data;
  } catch (error) {
    console.error("Edit course error:", error.response?.data || error.message);
    throw error;
  }
};


// ======================================================
// COMPATIBILITY ALIASES (Prevents Vite/UI crashes during migration)
// ======================================================

export const getStudentCourses = async () => {
  console.warn("getStudentCourses is deprecated. Please use batch endpoints.");
  return { success: true, courses: [] };
};

export const getMyCourseStudents = async () => {
  console.warn("getMyCourseStudents is deprecated.");
  return { success: true, courses: [] };
};

export const getInstructorAssignedCourse = async () => {
  console.warn("getInstructorAssignedCourse is deprecated.");
  return { success: true, courses: [] };
};

export const assignStudentsToCourse = async () => {
  throw new Error("Direct course assignment is deprecated. Use Batch assignment instead.");
};

export const assignInstructorsToCourse = async () => {
  throw new Error("Direct course assignment is deprecated. Use Batch assignment instead.");
};

export const getCourseStudents = async () => {
  return { success: true, course: { students: [] } };
};

export const getCourseInstructors = async () => {
  return { success: true, instructors: [] };
};

export const updateInstructorCourse = async () => {
  throw new Error("Deprecated");
};