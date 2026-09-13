import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOneCourse } from "../../api/course.service";
import { getMe } from "../../api/user.service";
import {
  createEnrollment,
  initiateEsewaPayment
} from "../../api/enrollment.service";

const Enrollment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, studentResponse] = await Promise.all([
          getOneCourse(courseId),
          getMe()
        ]);

        const courseData =
          courseResponse?.course ||
          courseResponse?.data ||
          courseResponse;

        const studentData =
          studentResponse?.user ||
          studentResponse?.data ||
          studentResponse;

        setCourse(courseData);
        setStudent(studentData);
      } catch (err) {
        console.error("Error fetching enrollment details:", err);

        const status = err.response?.status;

        if (status === 400 || status === 401 || status === 403) {
          navigate("/login", {
            state: {
              from: `/enroll/${courseId}`
            },
            replace: true
          });

          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load enrollment details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentDetails();
  }, [courseId, navigate]);

  const openPaymentModal = () => {
    setPaymentError("");
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    if (processingPayment) return;

    setPaymentError("");
    setShowPaymentModal(false);
  };

  const handleEnrollment = async () => {
    if (processingPayment || !courseId) return;

    try {
      setProcessingPayment(true);
      setPaymentError("");

      /*
       * Step 1:
       * Create a pending enrollment in the database.
       */
      const enrollmentResponse = await createEnrollment(courseId);

      const enrollment =
        enrollmentResponse?.enrollment ||
        enrollmentResponse?.data ||
        enrollmentResponse;

      const enrollmentId = enrollment?._id;

      if (!enrollmentId) {
        throw new Error("Enrollment ID was not returned by the server.");
      }

      /*
       * Step 2:
       * Ask the backend to prepare the eSewa payment.
       */
      const paymentResponse = await initiateEsewaPayment(enrollmentId);

      const paymentUrl = paymentResponse?.paymentUrl;
      const paymentData = paymentResponse?.paymentData;

      if (!paymentUrl || !paymentData) {
        throw new Error("Invalid payment details received from the server.");
      }

      /*
       * Step 3:
       * Create and submit the form required by eSewa.
       */
      const form = document.createElement("form");

      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = value;

        form.appendChild(input);
      });

      document.body.appendChild(form);

      /*
       * The browser now leaves the React application
       * and navigates to eSewa.
       */
      form.submit();
    } catch (err) {
      console.error("Enrollment/payment error:", err);

      setPaymentError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment. Please try again."
      );

      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">Loading enrollment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-lg bg-red-100 px-6 py-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!course || !student) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">
          Enrollment information is unavailable.
        </p>
      </div>
    );
  }

  const courseName =
    course.coursename ||
    course.courseName ||
    course.name ||
    "Selected course";

  const studentName =
    student.fullname ||
    student.fullName ||
    student.name ||
    "Student";

  const studentEmail = student.email || "Not available";

  const courseFee = Number(course.fee || 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-600">
              Course Enrollment
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Confirm Your Enrollment
            </h1>

            <p className="mt-2 text-gray-600">
              Review your information before proceeding to payment.
            </p>
          </div>

          <button
            type="button"
            onClick={openPaymentModal}
            disabled={processingPayment}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proceed to Payment
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Student Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{studentName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="break-words font-medium text-gray-900">
                  {studentEmail}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Selected Course
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Course Name</p>
                <p className="font-medium text-gray-900">{courseName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">
                  {course.duration
                    ? `${course.duration} ${course.unit || ""}`
                    : "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Course Fee</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rs. {courseFee.toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Payment Information
          </h2>

          <p className="text-gray-600">
            Your enrollment will remain pending until the payment is
            successfully verified by the system.
          </p>

          <button
            type="button"
            onClick={openPaymentModal}
            disabled={processingPayment}
            className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Pay with eSewa
          </button>
        </section>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="payment-modal-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  Confirm Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review the details before continuing.
                </p>
              </div>

              <button
                type="button"
                onClick={closePaymentModal}
                disabled={processingPayment}
                className="text-2xl leading-none text-gray-500 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Close payment modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-semibold text-gray-900">
                  {studentName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-semibold text-gray-900">{courseName}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    Total amount
                  </span>

                  <span className="text-xl font-bold text-blue-600">
                    Rs. {courseFee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                {paymentError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closePaymentModal}
                disabled={processingPayment}
                className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleEnrollment}
                disabled={processingPayment}
                className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingPayment
                  ? "Redirecting to eSewa..."
                  : "Pay with eSewa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;