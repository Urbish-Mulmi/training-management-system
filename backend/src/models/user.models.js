import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,required: true,trim: true,
    },

    email: {
      type: String,required: true,unique: true,lowercase: true,trim: true,
    },

    password: {
      type: String,required: true,
    },

    role: {
      type: String,enum: ["guest", "student", "instructor", "admin"],default: "guest",
    },

    isActive: {
      type: Boolean,default: true,
    },



    instructorProfile: {
      bio: {
        type: String,default: "",
      },

      experienceYears: {
        type: Number,
        default: 0,
      },

      subjects: {
        type: [String],
        default: [],
      },

      certifications: {
        type: [String],
        default: [],
      },

      profileComplete: {
        type: Boolean,
        default: false,
      },

      githubUrl: { type: String, default: "" },
      phone:{
      type:String, default: "",
    },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;


