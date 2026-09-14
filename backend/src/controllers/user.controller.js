import userModel from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createInvitation } from "../services/invitation.service.js";

const allowedRoles = ["guest", "student", "instructor", "admin"];

export const homePageBackend = (req, res) => {
  console.log("Homepage from Backend success");

  return res.status(200).json({
    message: "HomePage Success from user.controller.js",
    success: true,
  });
};

export const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email is already registered",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      message: "User Register Success",
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred in register user",
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User with this email not found",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Password Invalid",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("tms_token", token);

    return res.status(200).json({
      message: "User Login Success | tms_token created",
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occurred in login",
      success: false,
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.clearCookie("tms_token").status(200).json({
      message: "Logout success",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout Error",
      success: false,
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // verifyToken middleware must set req.verifyProof
    const verifiedUser = req.verifyProof;

    if (!verifiedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token Verified user profile fetched successfully",
      verifiedUserDetails: verifiedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching token verified user profile from DB",
      success: false,
      error: error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const role = req.query.role;

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    const filter = role ? { role } : {};

    const users = await userModel
      .find(filter)
      .select("fullname email role");

    return res.status(200).json({
      success: true,
      message: role
        ? `All ${role} users fetched successfully`
        : "All Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching users from DB",
      success: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (!req.verifyProof || req.verifyProof.role !== "admin") {
      return res.status(403).json({
        message: "Delete action exclusive to admin only",
        success: false,
      });
    }

    const { id } = req.params;

    // Prevent admin from deleting their own account
    if (req.verifyProof._id.toString() === id) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
        success: false,
      });
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User delete success",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in deleting user",
      success: false,
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role: unsanitizedRole } = req.body;

    if (typeof unsanitizedRole !== "string") {
      return res.status(400).json({
        message: "Role must be a string",
        success: false,
      });
    }

    const sanitizedRole = unsanitizedRole.toLowerCase().trim();

    // Only admin can change roles
    if (!req.verifyProof || req.verifyProof.role !== "admin") {
      return res.status(403).json({
        message: "You have no admin privilege",
        success: false,
      });
    }

    // Validate requested role
    if (!allowedRoles.includes(sanitizedRole)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
        success: false,
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User selected for role update not found",
        success: false,
      });
    }

    const previousRole = user.role;

    // No-op: requested role is the same as current role
    if (sanitizedRole === previousRole) {
      return res.status(200).json({
        message: `User's role is already ${sanitizedRole}`,
        success: true,
      });
    }

    /*
     * Role activation through email invitation.
     *
     * Guest/student/instructor/admin can be promoted
     * to student, instructor, or admin through invitation.
     *
     * The role is NOT changed here.
     * It will be changed after the user clicks
     * the invitation email.
     */
    if (
      sanitizedRole === "student" ||
      sanitizedRole === "instructor" ||
      sanitizedRole === "admin"
    ) {
      try {
        await createInvitation({
          userId: user._id,
          role: sanitizedRole,
          createdBy: req.verifyProof._id,
        });
      } catch (error) {
        console.error(
          "Invitation email failed to send:",
          error.message
        );

        return res.status(500).json({
          message: "Failed to send invitation email — role not changed",
          success: false,
          error: error.message,
        });
      }

      return res.status(200).json({
        message: `Invitation sent. Role will activate once the user confirms via email.`,
        success: true,
      });
    }

    /*
     * Guest role does not require email confirmation.
     * Apply it immediately.
     */
    user.role = sanitizedRole;
    await user.save();

    return res.status(200).json({
      message: "Role Update done",
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in updateUserRole",
      success: false,
      error: error.message,
    });
  }
};