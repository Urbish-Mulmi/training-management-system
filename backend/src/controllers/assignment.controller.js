import assignmentModel from '../models/assignment.model.js';
import submissionModel from '../models/submission.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// For Instructor: Create an assignment
export const createBatchAssignment = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { title, description, dueDate } = req.body;

    // Use req.verifyProof set by your verifyToken middleware
    const instructorId = req.verifyProof?._id || req.user?._id;

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor identity not found in request context.'
      });
    }

    let fileUrl = null;
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) fileUrl = cloudinaryResponse.secure_url;
    }

    const newAssignment = await assignmentModel.create({
      title,
      description,
      batch: batchId,
      dueDate,
      fileUrl,
      createdBy: instructorId
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Assignment Created', 
      assignment: newAssignment 
    });
  } catch (error) {
    next(error);
  }
};

// For Instructor: Delete an assignment and its associated submissions
export const deleteBatchAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const deletedAssignment = await assignmentModel.findByIdAndDelete(assignmentId);

    if (!deletedAssignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.'
      });
    }

    await submissionModel.deleteMany({ assignment: assignmentId });

    return res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// For Student & Instructor: Get all assignments for a batch
export const getBatchAssignment = async (req, res, next) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Batch ID is required.' 
      });
    }

    const assignments = await assignmentModel.find({ batch: batchId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

// For Instructor: Grade a submission
export const gradeBatchAssignment = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const instructorId = req.verifyProof?._id || req.user?._id;

    if (!grade) {
      return res.status(400).json({ 
        success: false, 
        message: 'Grade is required.' 
      });
    }

    const submission = await submissionModel.findById(submissionId).populate('assignment');

    if (!submission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Submission not found.' 
      });
    }

    if (submission.assignment.createdBy.toString() !== instructorId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You can only grade assignments created by you.' 
      });
    }

    submission.grade = grade;
    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    await submission.save();

    return res.status(200).json({
      success: true,
      message: 'Submission graded successfully.',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// For Student: Submit or re-submit assignment (Atomic Upsert)
export const submitBatchAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { githubUrl } = req.body;
    const studentId = req.verifyProof?._id || req.user?._id;

    let fileUrl = null;

    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload PDF file to Cloudinary.'
        });
      }
      fileUrl = cloudinaryResponse.secure_url;
    }

    if (!fileUrl && !githubUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a PDF file or a GitHub repository URL.'
      });
    }

    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.'
      });
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    const submission = await submissionModel.findOneAndUpdate(
      { assignment: assignmentId, student: studentId },
      {
        ...(fileUrl && { fileUrl }),
        ...(githubUrl && { githubUrl }),
        submittedAt: Date.now(),
        grade: 'Pending',
        feedback: ''
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: isLate ? 'Assignment submitted late.' : 'Assignment submitted successfully.',
      isLate,
      data: submission
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Submission conflict: A submission already exists for this assignment.'
      });
    }
    next(error);
  }
};

// 1. For Student: Get their own submission for an assignment
export const getMySubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.verifyProof?._id || req.user?._id;

    const submission = await submissionModel.findOne({
      assignment: assignmentId,
      student: studentId,
    });

    return res.status(200).json({
      success: true,
      data: submission || null, // returns null if student hasn't submitted yet
    });
  } catch (error) {
    next(error);
  }
};

// 2. For Instructor: Get all student submissions for a specific assignment
export const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await submissionModel
      .find({ assignment: assignmentId })
      .populate('student', 'name email avatar')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};