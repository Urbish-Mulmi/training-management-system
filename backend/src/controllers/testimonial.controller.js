import testimonialModel from "../models/testimonial.model.js";
import batchModel from "../models/batch.model.js";

// Student submits feedback
export const submitTestimonial = async (req, res) => {
  try {
    const studentId = req.verifyProof?._id;
    const { batchId } = req.params;
    const { rating, feedback } = req.body;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student ID not found.",
      });
    }

    if (!rating || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Rating and feedback are required.",
      });
    }

    const batch = await batchModel.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    // Student must belong to the batch
    if (
      !batch.students.some(
        (student) => student.toString() === studentId.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this batch.",
      });
    }

    // Batch must be completed
    if (!batch.isCompleted) {
      return res.status(400).json({
        success: false,
        message:
          "Feedback can only be submitted after course completion.",
      });
    }

    // Prevent multiple feedback submissions
    const existingTestimonial = await testimonialModel.findOne({
      student: studentId,
      batch: batchId,
    });

    if (existingTestimonial) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted feedback for this batch.",
      });
    }

    const testimonial = await testimonialModel.create({
      student: studentId,
      batch: batchId,
      rating,
      feedback,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      testimonial,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error submitting feedback.",
      error: error.message,
    });
  }
};

// Get approved testimonials for public display
export const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel
      .find({ status: "approved" })
      .populate("student", "fullname")
      .populate({
        path: "batch",
        select: "batchname course",
        populate: {
          path: "course",
          select: "coursename",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching testimonials.",
      error: error.message,
    });
  }
};

// Admin gets all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel
      .find()
      .populate("student", "fullname email")
      .populate("batch", "batchname")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching testimonials.",
      error: error.message,
    });
  }
};

// Admin approves/rejects testimonial
export const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial status.",
      });
    }

    const testimonial = await testimonialModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Testimonial ${status} successfully.`,
      testimonial,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating testimonial status.",
      error: error.message,
    });
  }
};

// Admin deletes testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialModel.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting testimonial.",
      error: error.message,
    });
  }
};