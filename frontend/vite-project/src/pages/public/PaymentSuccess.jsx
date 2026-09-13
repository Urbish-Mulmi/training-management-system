import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">

          {/* Success Icon */}
          <div className="w-14 h-14 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <span className="text-2xl text-green-600">
              ✓
            </span>
          </div>

          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mt-6">
            Payment Successful
          </p>

          <h1 className="text-2xl font-semibold text-gray-900 mt-2">
            Enrollment Confirmed
          </h1>

          <p className="text-sm text-gray-500 leading-6 mt-3">
            Your payment was successfully completed. Your
            enrollment has been recorded and is now awaiting
            administrative approval.
          </p>

          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-md p-4">
            <p className="text-xs text-gray-500 leading-5">
              Once your enrollment is approved and a batch is
              assigned, the course will become available in your
              My Courses section.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 py-3 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

