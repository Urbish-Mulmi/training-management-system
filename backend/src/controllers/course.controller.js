import { uploadOnCloudinary } from "../utils/cloudinary.js";
import courseModel from "../models/course.model.js";

// ======================================================
// GET ALL COURSES (Blueprints)
// ======================================================

export const getAllCourse = async (req, res) => {
  try {
    const data = await courseModel.find();

    return res.status(200).json({
      success: true,
      message: "Fetch all course success",
      courseCount: data.length,
      courses: data, // Normalized to match frontend expectations
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching all course",
      error: error.message,
    });
  }
};


// ======================================================
// GET ONE COURSE
// ======================================================

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await courseModel.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully.",
      course: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching course",
      error: error.message,
    });
  }
};


// ======================================================
// ADD COURSE
// ======================================================
export const addCourse = async (req, res) => {
  try {
    const { coursename, coursedescription, duration, unit, fee, prerequisite } = req.body;
    const existingCourse = await courseModel.findOne({ coursename });
    if (existingCourse) return res.status(400).json({ success: false, message: "Course with this name already exists" });

    const course = new courseModel({ coursename, coursedescription, duration, unit, fee, prerequisite });
    await course.validate();

    let uploadedSyllabus = null;
    if (req.file) {
      uploadedSyllabus = await uploadOnCloudinary(req.file.path, "tms-courses/syllabus");
      if (!uploadedSyllabus) return res.status(500).json({ success: false, message: "Failed to upload syllabus to Cloudinary." });
      course.syllabus = { url: uploadedSyllabus.secure_url, publicId: uploadedSyllabus.public_id };
    }

    try {
      await course.save();
    } catch (saveError) {
      if (uploadedSyllabus?.public_id) {
        await cloudinary.uploader.destroy(uploadedSyllabus.public_id, { resource_type: uploadedSyllabus.resource_type || "raw" });
      }
      throw saveError;
    }

    return res.status(201).json({ success: true, message: `New course named ${course.coursename} added`, courseAdded: course });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "Course name already exists." });
    return res.status(500).json({ success: false, message: "Error in Course adding", error: error.message });
  }
};

// ======================================================
// DELETE COURSE
// ======================================================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await courseModel.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course selected does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delete course success",
      courseDeleted: deletedCourse.coursename,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete course failed",
      error: error.message,
    });
  }
};


// ======================================================
// EDIT COURSE
// ======================================================

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "coursename",
      "coursedescription",
      "duration",
      "unit",
      "fee",
      "prerequisite",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (Object.hasOwn(req.body, field)) {
        updateData[field] = req.body[field];
      }
    });

    const courseData = await courseModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Selected course does not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      courseData,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Course name already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating course.",
      error: error.message,
    });
  }
};

// SEARCH COURSE implemented using (query params)and (.find along with regex , API debounce not yet used as this search happens only after pressing search button not live search)
export const searchCourse = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const searchedData = await courseModel.find({
      coursename: {
        $regex: q.trim(),
        $options: "i",
      },
    });

    return res.status(200).json({
      success: true,
      message: searchedData.length
        ? "Courses found successfully."
        : "No courses found.",
      courseCount: searchedData.length,
      courses: searchedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error searching courses.",
      error: error.message,
    });
  }
};