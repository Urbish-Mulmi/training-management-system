import jwt from 'jsonwebtoken';
import userModel from "../models/user.models.js"
export const verifyToken = async (req,res,next) =>{
  
  const token = req.cookies?.tms_token;

    if(!token){
      return res.status(401).json({
        message:"token not found to run || Please try again in logging in || msg from auth.middleware.js verifyToken[0]",
        success:false,
      })
    }    

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(401).json({ success: false, message: 'Not authorized' }); 

    // add clearance pass to request header
    req.verifyProof = user;

    // console.log("Authenticated User:", req.verifyProof);
    next();
  } catch (error) {
    return res.status(401).json({
      message:"Token verification error || Please try again in logging in || msg from auth.middleware.js verifyToken[1]",

      success:false,
      error:error.message,
    })
  }
}

export const isAdmin = (req,res,next)=>{

  const user = req.verifyProof;

  if(user.role !== "admin"){
    return res.status(403).json({
      message:"Privilege reserved for Admins only || msg from auth.middleware.js isAdmin check"
    })
  }
  next();
}

export const isInstructor = (req, res, next) => {
  if (req.verifyProof.role !== "instructor") {
    
    return res.status(403).json({
      success: false,
      message: "Privilege reserved for instructors only.",
    });
    
  }
  console.log('instructor middleware');
  next();
};

export const isStudent = (req, res, next) => {
  if (req.verifyProof.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Privilege reserved for student only.",
    });
  }
  console.log('students middleware');
  next();
};

export const isStudentOrInstructor = (req, res, next) => {
  if (req.verifyProof.role === 'student' || req.verifyProof.role === 'instructor') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
};

