import React, { useState, useEffect } from "react";
import {
  getAllBlogs,
  getBlog,
  addBlog,
  editBlog,
  deleteBlog,
} from "../../api/blog.service";
import toast from "react-hot-toast";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [featuredImage, setFeaturedImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [blogData, setBlogData] = useState({
    title: "",
    // slug: "", // Slug currently inactive; can be enabled later for SEO
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "draft",
  });

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      setBlogs(res.blogs || []);
    } catch (err) {
      toast.error("Failed to load blogs.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0] || null);
  };

  const handleOpenAdd = () => {
    setEditingBlogId(null);
    setFeaturedImage(null);
    setExistingImageUrl("");

    setBlogData({
      title: "",
      // slug: "", // Slug currently inactive; can be enabled later for SEO
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      status: "draft",
    });

    setIsDrawerOpen(true);
  };

  const handleOpenEdit = async (id) => {
    try {
      setLoading(true);

      const res = await getBlog(id);
      const data = res.blog || res.data || res;

      setEditingBlogId(id);

      setBlogData({
        title: data.title || "",
        // slug: data.slug || "", // Slug currently inactive; can be enabled later for SEO
        content: data.content || "",
        excerpt: data.excerpt || "",
        category: data.category || "",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        status: data.status || "draft",
      });

      setExistingImageUrl(data.featuredImage?.url || "");
      setFeaturedImage(null);

      setIsDrawerOpen(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load blog details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", blogData.title);
      // formData.append("slug", blogData.slug);
      // Slug currently inactive; can be enabled later for SEO

      formData.append("content", blogData.content);
      formData.append("excerpt", blogData.excerpt);
      formData.append("category", blogData.category);

      formData.append(
        "tags",
        JSON.stringify(
          blogData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );

      formData.append("status", blogData.status);

      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      if (editingBlogId) {
        const res = await editBlog(editingBlogId, formData);

        toast.success(
          res.message || "Blog updated successfully!"
        );
      } else {
        const res = await addBlog(formData);

        toast.success(
          res.message || "Blog created successfully!"
        );
      }

      setIsDrawerOpen(false);
      setFeaturedImage(null);
      setExistingImageUrl("");

      fetchBlogs();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Blog operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await deleteBlog(id);

      toast.success("Blog deleted successfully.");

      fetchBlogs();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete blog."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 relative">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Blog Management
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Create, edit, publish and manage blog posts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        >
          + Add New Blog
        </button>

      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {blogs.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No blogs found.
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >

              {/* Featured Image */}
              {blog.featuredImage?.url && (
                <img
                  src={blog.featuredImage.url}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5 space-y-3">

                {/* Title + Status */}
                <div className="flex justify-between items-start gap-3">

                  <h4 className="font-bold text-gray-900">
                    {blog.title}
                  </h4>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      blog.status === "published"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {blog.status}
                  </span>

                </div>

                {/* Excerpt */}
                <p className="text-sm text-gray-500">
                  {blog.excerpt || "No excerpt available."}
                </p>

                {/* Category + Tags */}
                <div className="flex flex-wrap gap-2 text-xs">

                  {blog.category && (
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      {blog.category}
                    </span>
                  )}

                  {blog.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>

                {/* Author */}
                <div className="text-xs text-gray-500 pt-2 border-t">

                  Author:{" "}

                  <strong>
                    {blog.author?.fullname || "Unknown"}
                  </strong>

                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">

                  <button
                    onClick={() => handleOpenEdit(blog._id)}
                    className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))
        )}

      </div>

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">

          <div>

            <h3 className="font-bold text-gray-900 text-base">
              {editingBlogId
                ? "Edit Blog"
                : "Add New Blog"}
            </h3>

            <p className="text-xs text-gray-500">
              {editingBlogId
                ? "Modify the existing blog post."
                : "Create a new blog post."}
            </p>

          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold p-2"
          >
            ✕
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 flex-1 overflow-y-auto"
        >

          {/* Title */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
            />

          </div>

          {/* Slug */}
          {/* Slug currently disabled.
              Keep this section commented so it can be enabled later for SEO.

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={blogData.slug}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="introduction-to-react"
            />

          </div>

          */}

          {/* Category */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={blogData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Programming"
            />

          </div>

          {/* Tags */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={blogData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, JavaScript, Frontend"
            />

            <p className="text-xs text-gray-400 mt-1">
              Separate tags with commas.
            </p>

          </div>

          {/* Excerpt */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>

            <textarea
              name="excerpt"
              value={blogData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short summary of the blog..."
            />

          </div>

          {/* Content */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>

            <textarea
              name="content"
              value={blogData.content}
              onChange={handleChange}
              rows="10"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your blog content..."
            />

          </div>

          {/* Status */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>

            <select
              name="status"
              value={blogData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>

            </select>

          </div>

          {/* Featured Image */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image
            </label>

            {/* Existing image */}
            {existingImageUrl && (
              <div className="relative mb-3">

                <img
                  src={existingImageUrl}
                  alt="Current featured"
                  className="w-full h-40 object-cover rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => setExistingImageUrl("")}
                  className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  ✕
                </button>

              </div>
            )}

            {/* Selected new image */}
            {featuredImage ? (
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2">

                <span className="text-sm text-gray-700 truncate">
                  {featuredImage.name}
                </span>

                <button
                  type="button"
                  onClick={() => setFeaturedImage(null)}
                  className="ml-3 text-gray-500 hover:text-red-600 font-bold"
                >
                  ✕
                </button>

              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm border border-gray-300 rounded-lg p-2"
              />
            )}

            {editingBlogId && (
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to keep the existing image.
              </p>
            )}

          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingBlogId
                ? "Update Blog"
                : "Create Blog"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}