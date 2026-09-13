import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    resourcename: {
      type: String,
      required: [true, "Resource name is required"],
      trim: true,
    },

    
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Resource must belong to a batch"]
    },

    uploadedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resourceurl: {
      type: String,
      trim: true,
      required: [true, "Resource URL is required"],
    },
    publicid: {
      type: String,
      default: ""
    },
    isvisible: {
      type: Boolean,
      default: true,
    },    
    resourcecategory: {
      type: String,
      required: [true, "Resource category is required"],
      enum: ["Notes" , "Syllabus", "video_folder", "video_link", "Other"],
      default: "Notes"
    },
    resourcetype: {
      type: String,
      enum: ["pdf", "document", "link", "other"],
      default: "pdf"
    },
    filehash: {
      type: String,
      index: true
    }, 
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;