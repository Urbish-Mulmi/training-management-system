import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlog } from "../../api/blog.service";
import toast from "react-hot-toast";

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await getBlog(id);
      setBlog(res.blog || res.data || res);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load blog."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-sm text-gray-500">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Blog not found
        </h2>

        <Link
          to="/blogs"
          className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6">

      {/* Back */}
      <Link
        to="/blogs"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        ← Back to Blogs
      </Link>

      {/* Header */}
      <div className="mt-6 space-y-4">

        {blog.category && (
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
            {blog.category}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {blog.title}
        </h1>

        <div className="text-sm text-gray-500">
          By {blog.author?.fullname || "Admin"}
          {blog.publishedAt && (
            <>
              {" • "}
              {new Date(blog.publishedAt).toLocaleDateString()}
            </>
          )}
        </div>

      </div>

      {/* Featured Image */}
      {blog.featuredImage?.url && (
        <img
          src={blog.featuredImage.url}
          alt={blog.title}
          className="w-full max-h-[500px] object-cover rounded-xl mt-8"
        />
      )}

      {/* Excerpt */}
      {blog.excerpt && (
        <p className="text-lg text-gray-600 mt-8">
          {blog.excerpt}
        </p>
      )}

      {/* Content */}
      <div className="mt-8 text-gray-800 leading-8 whitespace-pre-wrap">
        {blog.content}
      </div>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

    </article>
  );
}