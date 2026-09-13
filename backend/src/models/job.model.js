import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true
    },
    requirements: {
      type: [String],
      default: []
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    },
    applicationType: {
      type: String,
      enum: ['email', 'linkedin'],
      required: [true, 'Application type is required']
    },
    applicationLink: {
      type: String,
      required: [true, 'Application link is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    }
  },
  { timestamps: true }
);

const Job =  mongoose.model('Job', jobSchema);
export default Job;