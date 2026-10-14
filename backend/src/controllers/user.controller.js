import userModel from "../models/user.models.js";
import Enrollment from "../models/enrollment.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createInvitation } from "../services/invitation.service.js";

const allowedRoles = ["guest", "student", "instructor", "admin"];

export const homePageBackend = (req, res) => {
  console.log("Homepage from Backend success");

  return res.status(200).json({
    message: "Homepage Success from user.controller.js",
    success: true,
  });
};

// cloudfare based captcha setup
const verifyTurnstileToken = async (token) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret,
        response: token
      })
    }
  );

if (!response.ok) {
  const responseBody = await response.text();

  console.error("Turnstile Siteverify HTTP error:", {
    status: response.status,
    statusText: response.statusText,
    body: responseBody
  });

  throw new Error(`Cloudflare Siteverify returned HTTP ${response.status}`);
}

  const result = await response.json();

  return result.success === true;
};

// export const registerUser = async (req, res) => {
//   try {
//     const { fullname, email, password, phone } = req.body;

//     const existingUser = await userModel.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User with this email is already registered",
//         success: false,
//       });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const user = await userModel.create({
//       fullname,
//       email,
//       password: hashPassword,
//       phone,
//     });

//     return res.status(201).json({
//       message: "User Register Success",
//       success: true,
//       user: {
//         fullname: user.fullname,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error occurred in register user",
//       success: false,
//       error: error.message,
//     });
//   }
// };

// updated registerUser controller function with CAPTCHA setup
export const registerUser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone,
      turnstileToken
    } = req.body;

    if (
      typeof turnstileToken !== "string" ||
      !turnstileToken.trim()
    ) {
      return res.status(400).json({
        message: "Please complete the CAPTCHA verification",
        success: false
      });
    }

    let isCaptchaValid;

    try {
      isCaptchaValid = await verifyTurnstileToken(turnstileToken);
    } catch (error) {
      console.error("Turnstile verification error:", error.message);

      if (!process.env.TURNSTILE_SECRET_KEY) {
        return res.status(500).json({
          message: "CAPTCHA verification is not configured",
          success: false
        });
      }

      return res.status(502).json({
        message: "CAPTCHA verification service is unavailable",
        success: false
      });
    }

    if (!isCaptchaValid) {
      return res.status(400).json({
        message: "CAPTCHA verification failed. Please try again.",
        success: false
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email is already registered",
        success: false
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      email,
      password: hashPassword,
      phone
    });

    return res.status(201).json({
      message: "User Register Success",
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred in register user",
      success: false,
      error: error.message
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

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("tms_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

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
    const verifiedUser = req.verifyProof;

    // Guest — no authenticated session
    if (!verifiedUser) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        verifiedUserDetails: null,
        message:"Welcome Guest",
      });
    }

    const user = await userModel
      .findById(verifiedUser._id)
      .select("fullname email phone role");

    if (!user) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        verifiedUserDetails: null,
        message:"User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      message: "Authenticated user profile fetched successfully",
      verifiedUserDetails: user,
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

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel
      .findById(id)
      .select("fullname email phone");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const enrollments = await Enrollment.find({
      student: id,
    }).populate("batch", "batchname");

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        batches: enrollments.map((enrollment) => ({
          batch: enrollment.batch?.batchname || null,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching user details",
      success: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.verifyProof || req.verifyProof.role !== "admin") {
      return res.status(403).json({
        message: "Delete action exclusive to admin only",
        success: false,
      });
    }

    const { id } = req.params;

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

    if (!req.verifyProof || req.verifyProof.role !== "admin") {
      return res.status(403).json({
        message: "You have no admin privilege",
        success: false,
      });
    }

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

    if (sanitizedRole === previousRole) {
      return res.status(200).json({
        message: `User's role is already ${sanitizedRole}`,
        success: true,
      });
    }

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