import batchModel from '../models/batch.model.js';
import Assignment from '../models/assignment.model.js';
import resourceModel from '../models/resource.model.js';

// Create a new batch
export const createBatch = async (req, res) => {
  try {
    const { batchname, course, instructor } = req.body;

    const existingBatch = await batchModel.findOne({ batchname });
    if (existingBatch) {
      return res.status(400).json({ 
        success: false, 
        message: "A batch with this name already exists." 
      });
    }

    const newBatch = await batchModel.create({
      batchname,
      course,
      instructor: instructor || null,
      students: []
    });

    const populatedBatch = await batchModel.findById(newBatch._id)
      .populate('course', 'coursename coursedescription prerequisite')
      .populate('instructor', 'fullname email');

    res.status(201).json({ success: true, batch: populatedBatch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all batches (or filter by instructor/student if needed)
export const getAllBatches = async (req, res) => {
  try {
    const batches = await batchModel.find()
      .populate('course', 'coursename coursedescription prerequisite')
      .populate('instructor', 'fullname email')
      .populate('students', 'fullname email');
    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single batch details + its batch-specific assignments
export const getBatchDetails = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await batchModel.findById(batchId)
      .populate('course')
      .populate('instructor', 'fullname email')
      .populate('students', 'fullname email');

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    const assignments = await Assignment.find({ batch: batchId });

    res.status(200).json({
      success: true,
      batch,
      assignments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Delete a batch
export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const deletedBatch = await batchModel.findByIdAndDelete(batchId);

    if (!deletedBatch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    // Delete associated assignments too
    await Assignment.deleteMany({ batch: batchId });

    res.status(200).json({ success: true, message: "Batch deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// mark completion of a batch
export const markBatchCompleted = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { isCompleted } = req.body;

    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean.",
      });
    }

    const batch = await batchModel.findByIdAndUpdate(
      batchId,
      { isCompleted },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isCompleted
        ? "Batch marked as completed."
        : "Batch marked as not completed.",
      batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating batch completion status.",
      error: error.message,
    });
  }
};

// Assign/Enroll a student to a batch
export const assignStudentToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { studentId } = req.body;

    const batch = await batchModel.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    if (batch.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student is already in this batch." });
    }

    batch.students.push(studentId);
    await batch.save();

    res.status(200).json({ success: true, message: "Student assigned successfully.", batch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// remove a student from a batch using concept of filtering array
export const removeStudentFromBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { studentId } = req.body;

    const batch = await batchModel.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    if (!batch.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student is not in this batch." });
    }

    batch.students = batch.students.filter(
      student => student.toString() !== studentId
    );

    await batch.save();

    res.status(200).json({
      success: true,
      message: "Student removed successfully.",
      batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign/Change an instructor for a batch
export const assignInstructorToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { instructorId } = req.body;

    const batch = await batchModel.findByIdAndUpdate(
      batchId,
      { instructor: instructorId },
      { new: true }
    ).populate('instructor', 'fullname email');

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    res.status(200).json({ success: true, message: "Instructor assigned successfully.", batch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get batches assigned to the logged-in instructor
export const getInstructorBatches = async (req, res) => {
  try {
    const instructorId = req.verifyProof?._id;

    if (!instructorId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Instructor ID not found." });
    }

    const batches = await batchModel.find({ instructor: instructorId })
      .populate('course', 'coursename coursedescription prerequisite')
      .populate('instructor', 'fullname email')
      .populate('students', 'fullname email');

    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Instructor creates an assignment for a batch
export const createBatchAssignment = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { title, description, dueDate } = req.body;

    const newAssignment = await Assignment.create({
      title,
      description,
      batch: batchId,
      dueDate
    });

    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// functions by pov of student


export const getStudentBatches= async(req,res)=>{
  try { 
    const studentId = req.verifyProof?._id;

    if(!studentId){
      return res.status(401).json({success:false, message:"Student ID not found"});
    }
    const batches = await batchModel.find({'students':studentId})
    .select('-students')
    .populate('course', 'coursename coursedescription image duration unit')
    .populate('instructor', 'fullname email')
    .sort({ createdAt: -1 })

    res.status(200).json({success:true, 'count':batches.length,batches });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message });}

}


export const getStudentBatchDetails = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      return res.status(400).json({ success: false, message: "Batch ID is required" });
    }

    // Fixed Capitalization: Promise.all & Typos fixed: -students, plural destructuring
    const [batch, resources, assignments] = await Promise.all([
      batchModel.findById(batchId)
        .select('-students')
        .populate('course', 'coursename coursedescription duration unit')
        .populate('instructor', 'fullname email'),

      resourceModel.find({ batch: batchId, isvisible: true })
        .select('resourcename resourceurl resourcecategory resourcetype createdAt')
        .sort({ createdAt: -1 }),

      Assignment.find({ batch: batchId })
        .select('title description dueDate createdAt')
        .sort({ dueDate: 1 })
    ]);

    // Added safety check for missing batch
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    return res.status(200).json({
      success: true,
      batch: {
        ...batch.toObject(),
        resources,
        assignments
      }
    });

  } catch (error) {
    // Fixed res.status(500) and error.message
    return res.status(500).json({ success: false, message: error.message });
  }
};