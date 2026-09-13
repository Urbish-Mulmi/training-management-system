import resourceModel from "../models/resource.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js"; 
import crypto from "crypto";
import fs from "fs";

// Helper: Calculate MD5 hash for file deduplication
const getFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
};

// Helper: Strict domain check for YouTube or Google Drive URLs only
const isYouTubeOrDriveUrl = (urlString) => {
  try {
    const host = new URL(urlString).hostname.toLowerCase();

    // Check YouTube domains
    const isYouTube =
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtu.be";

    // Check Google Drive & Docs domains
    const isDrive =
      host === "drive.google.com" ||
      host === "docs.google.com";

    return isYouTube || isDrive;
  } catch {
    return false; // Rejects malformed URL strings
  }
};

// 1. ADD RESOURCE (File Upload or Validated Link)
export const addResource = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { resourcename, resourcecategory, resourceurl, resourcetype } = req.body;
    
    // Express / Multer file extraction
    const localFilePath = req.file?.path || (req.files && req.files[0]?.path);

    // REJECT DIRECT VIDEO FILE UPLOADS
    if (localFilePath && req.file?.mimetype?.startsWith("video/")) {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({
        success: false,
        message: "Direct video file uploads are not allowed. Please provide a YouTube or Google Drive link instead."
      });
    }

    // HANDLE FILE UPLOADS (Cloudinary Storage for Documents/Images)
    if (localFilePath) {
      const fileHash = await getFileHash(localFilePath);

      // Deduplication check within the same batch
      const existingResource = await resourceModel.findOne({
        batch: batchId,
        filehash: fileHash
      });

      if (existingResource) {
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return res.status(200).json({
          success: true,
          message: "Duplicate file detected. Reused existing resource.",
          resource: existingResource
        });
      }

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      // Clean up local temp file immediately after upload attempt
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

      if (!cloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed."
        });
      }

      // Create resource in DB using Cloudinary's secure URL
      const resource = await resourceModel.create({
        resourcename: resourcename || "Uploaded Document",
        resourceurl: cloudinaryResponse.secure_url,
        publicid: cloudinaryResponse.public_id || "",
        resourcecategory: resourcecategory || "Notes",
        resourcetype: resourcetype || "pdf",
        batch: batchId,
        uploadedby: req.user?._id || req.verifyProof?._id,
        filehash: fileHash
      });

      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        resource
      });
    }

    // HANDLE EXTERNAL LINKS (Validated YouTube or Drive Links)
    if (resourceurl) {
      if (!isYouTubeOrDriveUrl(resourceurl)) {
        return res.status(400).json({
          success: false,
          message: "Invalid link URL. Only official YouTube and Google Drive links are permitted."
        });
      }

      const resource = await resourceModel.create({
        resourcename: resourcename || "External Link / Video",
        resourceurl,
        publicid: "",
        resourcecategory: resourcecategory || "Other",
        resourcetype: resourcetype || "link",
        batch: batchId,
        uploadedby: req.user?._id || req.verifyProof?._id,
        filehash: null
      });

      return res.status(201).json({
        success: true,
        message: "Resource link added successfully",
        resource
      });
    }

    // FALLBACK IF NEITHER FILE NOR LINK IS PROVIDED
    return res.status(400).json({
      success: false,
      message: "Please attach a document file or provide a valid link URL."
    });

  } catch (error) {
    console.error("ADD RESOURCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding resource",
      error: error.message
    });
  }
};

// 2. GET ALL RESOURCES BY BATCH
export const getResourcesByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const resources = await resourceModel.find({ batch: batchId })
      .populate("uploadedby", "fullname email name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching resources",
      error: error.message,
    });
  }
};

// 3. TOGGLE RESOURCE VISIBILITY (isvisible: true <-> false)
export const toggleResourceVisibility = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await resourceModel.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    resource.isvisible = !resource.isvisible;
    await resource.save();

    return res.status(200).json({
      success: true,
      message: `Resource visibility changed to ${resource.isvisible}`,
      resource,
    });
  } catch (error) {
    console.error("TOGGLE VISIBILITY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error toggling visibility",
      error: error.message,
    });
  }
};

// 4. DELETE RESOURCE
export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await resourceModel.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Only destroy asset on Cloudinary if a valid publicid exists
    if (resource.publicid && resource.publicid.trim().length > 0) {
      await cloudinary.uploader.destroy(resource.publicid, { resource_type: "raw" });
    }

    await resource.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting resource",
      error: error.message,
    });
  }
};