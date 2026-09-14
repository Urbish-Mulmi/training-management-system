
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyEnrollments,
  initiateEsewaPayment
} from "../../api/enrollment.service";

const MyEnrollments = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyEnrollments();

        setEnrollments(response?.enrollments || []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);

        const status = err.response?.status;

        if (status === 400 || status === 401 || status === 403) {
          navigate("/login", {
            state: {
              from: "/my-enrollments"
            },
            replace: true
          });

          return;
        }

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your enrollments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [navigate]);

  const handlePayment = async (enrollmentId) => {
    if (processingPayment || !enrollmentId) return;

    try {
      setProcessingPayment(true);
      setError("");

      /*
       * Use the EXISTING enrollment.
       * Do not create another enrollment.
       */
      const paymentResponse =
        await initiateEsewaPayment(enrollmentId);

      const paymentUrl = paymentResponse?.paymentUrl;
      const paymentData = paymentResponse?.paymentData;

      if (!paymentUrl || !paymentData) {
        throw new Error(
          "Invalid payment details received from the server."
        );
      }

      /*
       * Create the form required by eSewa.
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
       * Redirect to eSewa.
       */
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);

      setError(
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
        <p className="text-gray-600">
          Loading your enrollments...
        </p>
      </div>
    );
  }

  if (error && enrollments.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-lg bg-red-100 px-6 py-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600">
            My Account
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            My Enrollments
          </h1>

          <p className="mt-2 text-gray-600">
            View your enrollment, payment, and batch status.
          </p>
        </div>

        {error && enrollments.length > 0 && (
          <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No enrollments found
            </h2>

            <p className="mt-2 text-gray-600">
              You have not enrolled in any courses yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              const batch = enrollment.batch;

              const courseName =
                course?.coursename || "Unknown course";

              const courseFee = Number(course?.fee || 0);

              const paymentPaid = Number(
                enrollment.paymentPaid || 0
              );

              const paymentRemaining = Number(
                enrollment.paymentRemaining || 0
              );

              return (
                <div
                  key={enrollment._id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  {/* Course + status */}
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {courseName}
                      </h2>

                      <p className="mt-1 text-gray-500">
                        {course?.duration
                          ? `${course.duration} ${
                              course.unit || ""
                            }`
                          : "Duration not specified"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          enrollment.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        Payment: {enrollment.paymentStatus}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          enrollment.enrollmentStatus ===
                          "approved"
                            ? "bg-green-100 text-green-700"
                            : enrollment.enrollmentStatus ===
                              "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        Enrollment:{" "}
                        {enrollment.enrollmentStatus}
                      </span>

                    </div>
                  </div>

                  {/* Payment / batch information */}
                  <div className="mt-6 grid gap-4 md:grid-cols-4">

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Course Fee
                      </p>

                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        Rs. {courseFee.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Paid
                      </p>

                      <p className="mt-1 text-lg font-semibold text-green-600">
                        Rs. {paymentPaid.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Remaining
                      </p>

                      <p className="mt-1 text-lg font-semibold text-red-600">
                        Rs. {paymentRemaining.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Batch
                      </p>

                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {batch?.batchname || "Not assigned"}
                      </p>
                    </div>

                  </div>

                  {/* Enrollment action/status */}
                  <div className="mt-6 border-t border-gray-200 pt-5">

                    {enrollment.paymentStatus === "pending" && (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-gray-600">
                          Payment is pending. Complete your
                          payment to proceed with enrollment
                          approval.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handlePayment(enrollment._id)
                          }
                          disabled={processingPayment}
                          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {processingPayment
                            ? "Redirecting..."
                            : "Pay Now"}
                        </button>

                      </div>
                    )}

                    {enrollment.paymentStatus === "paid" &&
                      enrollment.enrollmentStatus ===
                        "pending" && (
                        <p className="text-sm text-gray-600">
                          Payment completed. Your enrollment
                          is waiting for admin approval.
                        </p>
                      )}

                    {enrollment.enrollmentStatus ===
                      "approved" && (
                      <p className="text-sm text-green-700">
                        Your enrollment has been approved.
                        {batch?.batchname
                          ? ` You are assigned to ${batch.batchname}.`
                          : ""}
                      </p>
                    )}

                    {enrollment.enrollmentStatus ===
                      "rejected" && (
                      <p className="text-sm text-red-700">
                        Your enrollment has been rejected.
                      </p>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;