import CryptoJS from "crypto-js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import userModel from "../models/user.models.js";
import Batch from "../models/batch.model.js";


export const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.verifyProof._id;

    const course = await Course.findById(courseId);

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      enrollmentStatus: { $ne: "rejected" }
    });

    if (existing)
      return res.status(400).json({
        message: "Already enrolled in this course"
      });

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      paymentRemaining: course.fee || 0
    });

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const initiateEsewaPayment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const studentId = req.verifyProof._id;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: studentId
    });

    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });

    if (enrollment.paymentStatus === "paid")
      return res.status(400).json({
        message: "Enrollment is already paid"
      });

    const totalAmount = enrollment.paymentRemaining;
    const transactionUuid = `${enrollment._id}-${Date.now()}`;

    const productCode = process.env.ESEWA_PRODUCT_CODE;
    const secretKey = process.env.ESEWA_SECRET_KEY;

    const signedFieldNames =
      "total_amount,transaction_uuid,product_code";

    const message =
      `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

    const signature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(message, secretKey)
    );

    res.status(200).json({
      paymentUrl: process.env.ESEWA_PAYMENT_URL,

      paymentData: {
        amount: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: 0,
        product_delivery_charge: 0,

        success_url:
          `${process.env.BACKEND_URL}/api/enrollments/payment/success`,

        failure_url:
          `${process.env.BACKEND_URL}/api/enrollments/payment/failure`,

        signed_field_names: signedFieldNames,
        signature
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data)
      return res.status(400).json({
        message: "Payment response not found"
      });

    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    if (decodedData.status !== "COMPLETE")
      return res.status(400).json({
        message: "Payment was not completed"
      });

    const fields = decodedData.signed_field_names.split(",");

    const message = fields
      .map(field => `${field}=${decodedData[field]}`)
      .join(",");

    const expectedSignature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        message,
        process.env.ESEWA_SECRET_KEY
      )
    );

    if (decodedData.signature !== expectedSignature)
      return res.status(400).json({
        message: "Invalid payment signature"
      });

    const enrollmentId =
      decodedData.transaction_uuid.split("-")[0];

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment)
      return res.status(404).json({
        message: "Enrollment not found"
      });

    if (enrollment.paymentStatus === "paid")
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/success`
      );

    const paidAmount = Number(decodedData.total_amount);

    if (paidAmount !== enrollment.paymentRemaining)
      return res.status(400).json({
        message: "Payment amount does not match enrollment"
      });

    enrollment.paymentStatus = "paid";
    enrollment.paymentPaid = paidAmount;
    enrollment.paymentRemaining = 0;
    enrollment.enrollmentStatus = "pending";

    await enrollment.save();

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/success`
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const esewaPaymentFailure = async (req, res) => {
  return res.redirect(process.env.FRONTEND_URL);
};


/*
|--------------------------------------------------------------------------
| ADMIN: Get paid enrollments waiting for approval
|--------------------------------------------------------------------------
*/

export const getPendingPaidEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      paymentStatus: "paid",
      enrollmentStatus: "pending"
    })
      .populate("student", "fullname email role")
      .populate(
        "course",
        "coursename fee duration unit"
      )
      .populate(
        "batch",
        "batchname startDate endDate"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Pending paid enrollments fetched successfully",
      enrollments
    });
  } catch (error) {
    console.error(
      "Get pending paid enrollments error:",
      error
    );

    return res.status(500).json({
      message: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN: Get available batches for a course
|--------------------------------------------------------------------------
*/

export const getBatchesForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const batches = await Batch.find({
      course: courseId,
      isCompleted: false
    })
      .populate("instructor", "fullname email")
      .sort({ startDate: 1 });

    return res.status(200).json({
      message: "Batches fetched successfully",
      batches
    });
  } catch (error) {
    console.error(
      "Get batches for course error:",
      error
    );

    return res.status(500).json({
      message: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN: Approve enrollment and assign batch
|--------------------------------------------------------------------------
*/

export const approveEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({
        message: "Batch ID is required"
      });
    }

    const enrollment = await Enrollment.findById(
      enrollmentId
    );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found"
      });
    }

    /*
     * Payment must be completed before approval.
     */
    if (enrollment.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Payment has not been completed"
      });
    }

    /*
     * Prevent approving the same enrollment twice.
     */
    if (enrollment.enrollmentStatus !== "pending") {
      return res.status(400).json({
        message: "Enrollment has already been processed"
      });
    }

    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found"
      });
    }

    /*
     * The selected batch MUST belong to the
     * course the student actually enrolled in.
     */
    if (
      String(batch.course) !==
      String(enrollment.course)
    ) {
      return res.status(400).json({
        message:
          "Selected batch does not belong to this course"
      });
    }

    /*
     * Find the user.
     */
    const student = await userModel.findById(
      enrollment.student
    );

    if (!student) {
      return res.status(404).json({
        message: "Student user not found"
      });
    }

    /*
     * Promote guest/user to student.
     */
    student.role = "student";

    await student.save();

    /*
     * Assign batch to enrollment.
     */
    enrollment.batch = batch._id;
    enrollment.enrollmentStatus = "approved";

    await enrollment.save();

    /*
     * Add student to batch.
     * Prevent duplicate student IDs.
     */
    const alreadyInBatch = batch.students.some(
      studentId =>
        String(studentId) ===
        String(enrollment.student)
    );

    if (!alreadyInBatch) {
      batch.students.push(enrollment.student);
      await batch.save();
    }

    /*
     * Return updated enrollment.
     */
    const updatedEnrollment =
      await Enrollment.findById(enrollment._id)
        .populate(
          "student",
          "fullname email role"
        )
        .populate(
          "course",
          "coursename fee duration unit"
        )
        .populate(
          "batch",
          "batchname startDate endDate"
        );

    return res.status(200).json({
      message: "Enrollment approved successfully",
      enrollment: updatedEnrollment
    });

  } catch (error) {
    console.error(
      "Approve enrollment error:",
      error
    );

    return res.status(500).json({
      message: error.message
    });
  }
};