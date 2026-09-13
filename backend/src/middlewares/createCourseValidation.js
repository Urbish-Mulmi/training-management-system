export const createCourseValidation = (req, res, next) => {
  const {
    coursename,
    coursedescription,
    duration,
    unit,
    fee,
    prerequisite,
  } = req.body;

  const errors = [];
    
  if (!coursename?.trim()) {
    errors.push("Course name is required.");
  }

  if (!coursedescription?.trim()) {
    errors.push("Course description is required.");
  }

  if (!duration || duration < 1) {
    errors.push("Duration must be at least 1.");
  }

  if (!["week", "month"].includes(unit)) {
    errors.push("Unit must be either 'week' or 'month'.");
  }

  if (fee == null || fee < 0) {
    errors.push("Fee must be 0 or greater.");
  }

  if (!prerequisite?.trim()) {
    errors.push("Prerequisite is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};