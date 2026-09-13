export const updateCourseValidation = (req, res, next) => {
  const {
    coursename,coursedescription,duration,unit,fee,prerequisite,
  } = req.body;

  const errors = [];

  if ("coursename" in req.body && !coursename?.trim()) {
    errors.push("Course name cannot be empty.");
  }

  if ("coursedescription" in req.body && !coursedescription?.trim()) {
    errors.push("Course description cannot be empty.");
  }

  if ("duration" in req.body && duration < 1) {
    errors.push("Duration must be at least 1.");
  }

  if ("unit" in req.body && !["week", "month"].includes(unit)) {
    errors.push("Invalid duration unit.");
  }

  if ("fee" in req.body && fee < 0) {
    errors.push("Fee cannot be negative.");
  }

  if ("prerequisite" in req.body && !prerequisite?.trim()) {
    errors.push("Prerequisite cannot be empty.");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};