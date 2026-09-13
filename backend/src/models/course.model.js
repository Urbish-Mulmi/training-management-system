import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    coursename: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },    

    image: {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
      },
    },

    coursedescription: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["week", "month"],
    },

    fee: {
      type: Number,
      min: 0,
    },

    prerequisite: {
      type: String,
      trim: true,
    },
    
    syllabus: {
      url: String,
      publicId: String,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;