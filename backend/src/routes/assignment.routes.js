import express from 'express';
import {
  createBatchAssignment,
  deleteBatchAssignment,
  getBatchAssignment,
  gradeBatchAssignment,
  submitBatchAssignment,
  getMySubmission,
  getAssignmentSubmissions 
} from '../controllers/assignment.controller.js';

import { 
  verifyToken, 
  isInstructor, 
  isStudent, 
  isStudentOrInstructor 
} from '../middlewares/auth.middleware.js';
import { uploadPdf } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Protect all routes and populate req.user
router.use(verifyToken);

// 1. Batch-Scoped Assignments
router.route('/batch/:batchId')
  .get(isStudentOrInstructor, getBatchAssignment)
  .post(isInstructor, uploadPdf.single('assignmentFile'), createBatchAssignment);

// 2. Direct Assignment & Submission Listing Actions
router.delete('/:assignmentId', isInstructor, deleteBatchAssignment);
router.post('/:assignmentId/submit', isStudent, uploadPdf.single('submissionFile'), submitBatchAssignment);

// 🚨 ADD THIS: Route for instructor to view all submissions for a specific assignment
router.get('/:assignmentId/submissions', isInstructor, getAssignmentSubmissions);

// 3. Direct Submission Actions (Grading)
router.patch('/submissions/:submissionId', isInstructor, gradeBatchAssignment);

// Add this under your student/instructor routes
router.get('/:assignmentId/my-submission', isStudent, getMySubmission);

export default router;