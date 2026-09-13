import api from "./apiInstance.js";

export const getAllBlogs = async () => {
  try {
    const res = await api.get("/blogs/get-all-blogs");
    console.log("Get all blogs success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get all blogs error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getPublishedBlogs = async () => {
  try {
    const res = await api.get("/blogs/get-published-blogs");
    console.log("Get published blogs success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Get published blogs error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getBlog = async (id) => {
  try {
    const res = await api.get(`/blogs/${id}/get-blog`);
    return res.data;
  } catch (error) {
    console.error("Get blog error: ", error.response?.data || error.message);
    throw error;
  }
};

export const addBlog = async (blogData) => {
  try {
    const res = await api.post("/blogs/add-blog", blogData);
    console.log("Add blog success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Add blog error: ", error.response?.data || error.message);
    throw error;
  }
};

export const editBlog = async (id, blogData) => {
  try {
    const res = await api.patch(`/blogs/${id}/edit-blog`, blogData);
    console.log("Edit blog success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Edit blog error: ", error.response?.data || error.message);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const res = await api.delete(`/blogs/${id}/delete-blog`);
    console.log("Delete blog success: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Delete blog error: ", error.response?.data || error.message);
    throw error;
  }
};