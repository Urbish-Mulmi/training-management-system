import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // slug: {
    //   type: String,      
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    // },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      trim: true,
    },

    featuredImage: {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
        trim: true,
      },
    },

    category: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },    

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;