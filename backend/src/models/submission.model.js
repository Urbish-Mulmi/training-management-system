import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Assignment', 
      required: true 
    },
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    fileUrl: { 
      type: String, 
      default: null 
    },
    githubUrl: { 
      type: String, 
      trim: true,
      default: null 
    },
    grade: { 
      type: String, 
      enum: ['A', 'B', 'C', 'D', 'F', 'Pending'], 
      default: 'Pending' 
    },
    feedback: { 
      type: String, 
      default: '' 
    },
    submittedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

// COMPOUND UNIQUE INDEX: Enforces 1 submission per (assignment + student) pair
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);