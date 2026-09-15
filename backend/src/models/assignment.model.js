import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true,'Title is required' ],
      trim: true 
    },
    batch: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Batch', 
      required: [true,'Batch is required' ]
    },
    description:{
      type:String,trim:true, default:"",
    },
    dueDate: { 
      type: Date, 
      required: [true,'Due date is required' ] 
    },
    fileUrl: { 
      type: String, 
      default: null 
    }, // Optional Cloudinary/Storage URL for question paper/PDF attached by instructor
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);