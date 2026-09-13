import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

// CHANGED: folder is now a parameter.
// If no folder is provided, existing uploads still use "tms-course-resources" for resource, assignment
const uploadOnCloudinary = async (
  localFilePath,
  folder = "tms-course-resources"
) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      type: "upload",

      // CHANGED: use the folder parameter instead of
      // hardcoding "tms-course-resources".
      folder: folder,

      use_filename: true,
      unique_filename: true,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { cloudinary, uploadOnCloudinary };