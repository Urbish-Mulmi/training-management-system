import express from 'express';
import { 
  getAllBatches, 
  createBatch,
  getBatchDetails, 
  createBatchAssignment, 
  deleteBatch, 
  assignStudentToBatch, 
  assignInstructorToBatch,
  getInstructorBatches ,
  getStudentBatches,
  getStudentBatchDetails,
  markBatchCompleted,
  removeStudentFromBatch
} from '../controllers/batch.controller.js';
import { verifyToken, isAdmin, isInstructor, isStudent } from '../middlewares/auth.middleware.js';;

const router = express.Router();

// Static routes FIRST
router.get('/', verifyToken, getAllBatches);
router.post('/', verifyToken, isAdmin, createBatch);
router.get('/instructor-batches', verifyToken, isInstructor, getInstructorBatches);

router.get('/my-enrollment', verifyToken, isStudent, getStudentBatches)

// Dynamic routes after
router.get('/:batchId', verifyToken, getBatchDetails);
router.post('/:batchId/assignments', verifyToken, isInstructor, createBatchAssignment);
router.delete('/:batchId', verifyToken, isAdmin, deleteBatch);
router.patch('/:batchId/assign-student', verifyToken, isAdmin, assignStudentToBatch);
router.patch('/:batchId/assign-instructor', verifyToken, isAdmin, assignInstructorToBatch);

router.get('/:batchId/classroom', verifyToken, isStudent, getStudentBatchDetails);

router.patch("/:batchId/complete",verifyToken,isAdmin,markBatchCompleted);
router.patch("/:batchId/remove-student",verifyToken,isAdmin,removeStudentFromBatch);

export default router;