import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", default: null },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  paymentPaid: { type: Number, default: 0, min: 0 },
  paymentRemaining: { type: Number, required: true, min: 0 },
  enrollmentStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Enrollment", enrollmentSchema);