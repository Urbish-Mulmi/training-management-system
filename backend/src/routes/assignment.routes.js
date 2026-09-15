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

// 2. Delete Assignment 
router.delete('/:assignmentId', isInstructor, deleteBatchAssignment);

// 3. Route for instructor to view all submissions for a specific assignment
router.get('/:assignmentId/submissions', isInstructor, getAssignmentSubmissions);

// 4.  Submission Grading
router.patch('/submissions/:submissionId', isInstructor, gradeBatchAssignment);

// 5. Student submit assignment
router.post('/:assignmentId/submit', isStudent, uploadPdf.single('submissionFile'), submitBatchAssignment);

// 6. Student see own submission for a specific assignment
router.get('/:assignmentId/my-submission', isStudent, getMySubmission);

export default router;