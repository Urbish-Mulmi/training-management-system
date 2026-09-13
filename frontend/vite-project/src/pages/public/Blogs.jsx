import React, { useEffect, useState } from "react";
import { getPublishedBlogs } from "../../api/blog.service";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await getPublishedBlogs();
      setBlogs(res.blogs || []);
    } catch (error) {
      toast.error("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-sm text-gray-500">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Our Blog
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Explore our latest articles, insights and updates.
        </p>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          No published blogs available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >

              {/* Image */}
              {blog.featuredImage?.url ? (
                <img
                  src={blog.featuredImage.url}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}

              <div className="p-5 space-y-3">

                {/* Category */}
                {blog.category && (
                  <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                    {blog.category}
                  </span>
                )}

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900">
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-gray-500">
                  {blog.excerpt || "Read this article to learn more."}
                </p>

                {/* Author / Date */}
                <div className="text-xs text-gray-400">
                  By {blog.author?.fullname || "Admin"}
                  {blog.publishedAt && (
                    <>
                      {" • "}
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </>
                  )}
                </div>

                {/* Read More */}
                <Link
                  to={`/blogs/${blog._id}`}
                  className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Read More →
                </Link>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}