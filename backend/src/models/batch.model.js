import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  batchname: { type: String, required: true, lowercase:true, unique:true }, 
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date },
  endDate: { type: Date },
  isCompleted: {  type: Boolean,  default: false},
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);