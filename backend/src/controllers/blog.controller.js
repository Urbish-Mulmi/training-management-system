import blogModel from "../models/blog.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js";


// ======================================================
// CREATE BLOG
// ======================================================

export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body;

    // Slug currently inactive. Can be enabled later for SEO-friendly URLs.

    // Convert tags from JSON string to array
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Create a Mongoose document in memory; "new blogModel()" 
    // Why to do so? so that schema constraints  can validate the data before saving it to MongoDB, earlier without this there  was an issue that coudinary image saving was done even though data were not valid as per schema defined.So to prevent that we are runnning in memory validation.
    const blog = new blogModel({
      title,
      content,
      excerpt,
      category,
      tags: parsedTags,
      status,
      author: req.verifyProof._id,
      publishedAt: status === "published" ? new Date() : null
    });

    await blog.validate();

    // Upload featured image after validation
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path, "blogs");

      if (!uploadedImage) {
        return res.status(500).json({
          success: false,
          message: "Featured image upload failed.",
        });
      }

      blog.featuredImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      };
    }

    // Save final validated blog and featured image saved in cloudinary urls in database
    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating blog.",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE BLOG
// ======================================================

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBlog = await blogModel.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog does not exist.",
      });
    }

    const allowedFields = [
      "title",
      // "slug", // Slug currently inactive; can be enabled later for SEO
      "content",
      "excerpt",
      "category",
      "tags",
      "status",
    ];

    const updateData = {};

    // Convert tags from JSON string to array
    if (typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }

    allowedFields.forEach((field) => {
      if (Object.hasOwn(req.body, field)) {
        updateData[field] = req.body[field];
      }
    });

    // Handle publishing
    if (req.body.status === "published") {
      updateData.publishedAt = new Date();
    }

    if (req.body.status === "draft") {
      updateData.publishedAt = null;
    }

    // Handle new featured image
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path, "blogs");

      if (!uploadedImage) {
        return res.status(500).json({
          success: false,
          message: "Featured image upload failed.",
        });
      }

      // Delete old image after new image upload succeeds
      if (existingBlog.featuredImage?.publicId) {
        await cloudinary.uploader.destroy(existingBlog.featuredImage.publicId);
      }

      updateData.featuredImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const blog = await blogModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating blog.",
      error: error.message,
    });
  }
};


// ======================================================
// GET ALL BLOGS
// ======================================================

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel
      .find()
      .populate("author", "fullname")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogCount: blogs.length,
      blogs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blogs.",
      error: error.message,
    });
  }
};


// ======================================================
// GET PUBLISHED BLOGS
// ======================================================

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await blogModel
      .find({ status: "published" })
      .populate("author", "fullname")
      .sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      blogCount: blogs.length,
      blogs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching published blogs.",
      error: error.message,
    });

  }
};


// ======================================================
// GET ONE BLOG
// ======================================================

export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel
      .findById(id)
      .populate("author", "fullname");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blog.",
      error: error.message,
    });
  }
};


// ======================================================
// DELETE BLOG
// ======================================================

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog does not exist.",
      });
    }

    if (blog.featuredImage?.publicId) {
      await cloudinary.uploader.destroy(blog.featuredImage.publicId);
    }

    await blogModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
      blogDeleted: blog.title,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting blog.",
      error: error.message,
    });
  }
};